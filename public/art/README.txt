ABNORMAL artwork providers

The live character stage tries these free SFW sources in sequence:
1. Nekos.best (SFW-only anime images; artist/source metadata when available)
2. Waifu.im (IsNsfw=False, explicit tags excluded; swimsuit/bikini-style art may appear only when categorized as SFW)
3. Waifu.pics (/sfw endpoints only)

Local images in this folder are always the immediate fallback. Remote artwork is fetched in the background and only replaces local art after a successful image download. Provider availability and CORS policies can change; failed sources are skipped and the next source is tried. Do not change these endpoints to NSFW routes.
