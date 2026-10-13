/**
 * Support link helpers.
 *
 * Reject placeholder URLs instead of rendering links that appear to work.
 * The configured Discord, Telegram and WhatsApp links are validated here
 * before support buttons are rendered.
 */

export type ResolvedSupportLink = {
  /** Usable href, or undefined while the placeholder is still in place. */
  href?: string;
  /** True when a real URL has been configured. */
  configured: boolean;
};

const PLACEHOLDER_HINTS = ['your_', 'your-', 'example.com', 'changeme', 'replace-me'];

export function resolveSupportLink(url: string | undefined): ResolvedSupportLink {
  if (!url) return { configured: false };

  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  const looksLikePlaceholder = PLACEHOLDER_HINTS.some((hint) => lower.includes(hint));
  const isValidUrl = /^https?:\/\/[^\s]+$/i.test(trimmed);

  if (!isValidUrl || looksLikePlaceholder) return { configured: false };
  return { href: trimmed, configured: true };
}
