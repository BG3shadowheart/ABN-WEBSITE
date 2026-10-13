'use client';

import { useEffect, useRef, useState } from 'react';
import { CHARACTER_SLOTS, DEFAULT_THEME, THEME_IDS, isTheme, type ThemeId } from '@/lib/themes';

type Art = { url: string; mobileUrl?: string; artist?: string; link?: string };
type ApiImage = { url?: string };
async function optimizeImage(blob: Blob): Promise<Blob> {
  if (typeof createImageBitmap !== 'function') return blob;
  let bitmap: ImageBitmap | undefined;
  try {
    bitmap = await createImageBitmap(blob);
    const maxDimension = 1200;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) return blob;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const optimized = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82));
    return optimized ?? blob;
  } catch {
    return blob;
  } finally {
    bitmap?.close();
  }
}

/**
 * Progressive art loading: the bundled local cutout is rendered immediately,
 * so fast scrolling, slow networks and offline browsing never wait for remote
 * artwork. The online SFW provider runs in the background; only a verified
 * transparent image replaces the local fallback after it finishes loading.
 */
async function fetchOnlineArt(theme: ThemeId, signal: AbortSignal): Promise<Blob> {
  const [category, index] = CHARACTER_SLOTS[theme];
  const candidates: string[] = [];
  const failures: string[] = [];

  // Provider 1: Nekos.best — free, CORS-enabled and SFW-only.
  try {
    const response = await fetch(`https://nekos.best/api/v2/${category}?amount=${index + 1}`, {
      signal, headers: { Accept: 'application/json' }, cache: 'no-store',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json() as { results?: ApiImage[] };
    const url = data.results?.[index]?.url ?? data.results?.[0]?.url;
    if (url) candidates.push(url); else throw new Error('no image URL');
  } catch (error) { failures.push(`Nekos.best: ${String(error)}`); }

  // Provider 2: Waifu.im — explicitly request SFW results and exclude explicit tags.
  // A tagged swimsuit/bikini result may appear if the provider has one, but NSFW
  // results are never requested.
  try {
    const params = new URLSearchParams({ IsNsfw: 'False', PageSize: '8' });
    params.append('IncludedTags', category === 'neko' ? 'waifu' : category);
    for (const tag of ['hentai', 'explicit', 'sexual', 'nude']) params.append('ExcludedTags', tag);
    const response = await fetch(`https://api.waifu.im/images?${params}`, {
      signal, headers: { Accept: 'application/json' }, cache: 'no-store',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json() as { items?: ApiImage[] };
    const urls = (data.items ?? []).map((item) => item.url).filter((url): url is string => !!url);
    if (urls.length) candidates.push(...urls); else throw new Error('no image URLs');
  } catch (error) { failures.push(`Waifu.im: ${String(error)}`); }

  // Provider 3: Waifu.pics — extra SFW fallback when the first two providers fail.
  try {
    const response = await fetch(`https://api.waifu.pics/sfw/${category === 'husbando' ? 'waifu' : category}`, {
      signal, headers: { Accept: 'application/json' }, cache: 'no-store',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json() as ApiImage;
    if (data.url) candidates.push(data.url); else throw new Error('no image URL');
  } catch (error) { failures.push(`Waifu.pics: ${String(error)}`); }

  for (const url of [...new Set(candidates)]) {
    try {
      const imageResponse = await fetch(url, { signal, mode: 'cors', cache: 'default' });
      if (!imageResponse.ok) throw new Error(`image HTTP ${imageResponse.status}`);
      const blob = await imageResponse.blob();
      if (!blob.type.startsWith('image/')) throw new Error('response was not an image');
      // Provider images often include a full rectangular background. Run a
      // real foreground segmentation pass before allowing them into the stage.
      // If segmentation fails, reject this candidate and try the next provider
      // rather than displaying an ugly opaque rectangle over the page.
      const { removeBackground } = await import('@imgly/background-removal');
      const cutout = await removeBackground(blob, {
        output: { format: 'image/png', quality: 0.92 },
      });
      if (!cutout.type.includes('png')) throw new Error('background removal did not return PNG cutout');
      const bitmap = await createImageBitmap(cutout);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(bitmap.width, 1400);
        canvas.height = Math.round(bitmap.height * (canvas.width / bitmap.width));
        const context = canvas.getContext('2d');
        if (!context) throw new Error('could not verify cutout transparency');
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let transparent = false;
        for (let i = 3; i < pixels.length; i += 4) { if (pixels[i] < 245) { transparent = true; break; } }
        if (!transparent) throw new Error('image background was not removed');
      } finally { bitmap.close(); }
      return optimizeImage(cutout);
    } catch (error) { failures.push(`${url}: ${String(error)}`); }
  }
  throw new Error(failures.join('; ') || 'No SFW artwork provider returned an image');
}

/** Shared scene art behind the entire site; each section switches the active theme. */
export function CharacterStage({ local }: { local: Partial<Record<ThemeId, Art>> }) {
  const [active, setActive] = useState<ThemeId>(DEFAULT_THEME);
  const [armed, setArmed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [onlineArt, setOnlineArt] = useState<Partial<Record<ThemeId, string>>>({});
  const [onlineRetry, setOnlineRetry] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const attempted = useRef(new Set<ThemeId>());
  const objectUrls = useRef<string[]>([]);
  const onlineControllers = useRef(new Map<ThemeId, AbortController>());
  const onlineTimers = useRef(new Map<ThemeId, number>());

  useEffect(() => {
    const html = document.documentElement;
    const read = () => {
      const value = html.dataset.theme;
      if (isTheme(value)) setActive(value);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1023px)');
    let timer: number | undefined;
    const sync = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      setIsMobile(query.matches);
      if (query.matches) {
        setArmed(false);
      } else {
        timer = window.setTimeout(() => setArmed(true), 700);
      }
    };
    sync();
    query.addEventListener('change', sync);
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      query.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    const refreshOnlineArtwork = () => setOnlineRetry((value) => value + 1);
    window.addEventListener('online', refreshOnlineArtwork);
    return () => window.removeEventListener('online', refreshOnlineArtwork);
  }, []);

  // Preserve the original per-theme CSS colours; character art never recolours the whole page.

  useEffect(() => {
    // Start a background queue for every theme, not only the currently visible
    // one. Local art paints immediately; remote artwork fills later sections
    // while the visitor reads or scrolls. One request at a time avoids
    // saturating slow mobile connections.
    let cancelled = false;
    const queue = THEME_IDS.filter((theme) => local[theme] && !onlineArt[theme] && !attempted.current.has(theme));
    const runQueue = async () => {
      for (const theme of queue) {
        if (cancelled) return;
        if (!navigator.onLine) {
          await new Promise<void>((resolve) => {
            const online = () => { window.removeEventListener('online', online); resolve(); };
            window.addEventListener('online', online, { once: true });
          });
          if (cancelled) return;
        }
        attempted.current.add(theme);
        const controller = new AbortController();
        onlineControllers.current.set(theme, controller);
        const timeout = window.setTimeout(() => controller.abort(), 25000);
        onlineTimers.current.set(theme, timeout);
        try {
          const blob = await fetchOnlineArt(theme, controller.signal);
          if (!cancelled && !controller.signal.aborted) {
            const url = URL.createObjectURL(blob);
            objectUrls.current.push(url);
            setOnlineArt((current) => current[theme] ? current : ({ ...current, [theme]: url }));
          }
        } catch {
          // Keep local art visible and retry this theme after a short delay.
          attempted.current.delete(theme);
        } finally {
          window.clearTimeout(timeout);
          onlineTimers.current.delete(theme);
          onlineControllers.current.delete(theme);
        }
        if (!cancelled && !onlineArt[theme]) await new Promise((resolve) => window.setTimeout(resolve, 1200));
      }
    };
    void runQueue();
    return () => { cancelled = true; };
  }, [local, onlineArt, onlineRetry]);

  useEffect(() => () => {
    for (const controller of onlineControllers.current.values()) controller.abort();
    for (const timer of onlineTimers.current.values()) window.clearTimeout(timer);
    for (const url of objectUrls.current) URL.revokeObjectURL(url);
  }, []);

  const handleImageLoad = (_theme: ThemeId, _image: HTMLImageElement) => {
    // Intentionally no palette extraction: keep the original designed theme colours.
  };

  return (
    <div ref={root}>
      {THEME_IDS.map((theme) => {
        const art = local[theme];
        const isLoaded = !!art && (theme === active || (armed && !isMobile));
        const remote = onlineArt[theme];
        return (
          <div key={theme} className={`stage stage-${theme}`}>
            <div aria-hidden="true" className="stage-aura" />
            <div aria-hidden="true" className="stage-ring" />
            <div aria-hidden="true" className="stage-ring stage-ring--inner" />
            <div aria-hidden="true" className="stage-art">
              {isLoaded && art ? (
                remote ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="stage-img" src={remote} alt="" decoding="async" onLoad={(event) => handleImageLoad(theme, event.currentTarget)} />
                ) : (
                  <picture>
                    {art.mobileUrl ? <source media="(max-width: 1023px)" srcSet={art.mobileUrl} type="image/webp" /> : null}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="stage-img" src={art.url} alt="" decoding="async" onLoad={(event) => handleImageLoad(theme, event.currentTarget)} />
                  </picture>
                )
              ) : null}
            </div>
            {art?.artist && theme === active ? (
              <a className="stage-credit" href={art.link} target="_blank" rel="noopener noreferrer">
                Art: {art.artist}
              </a>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
