CHARACTER ART
=============

The full-size .webp files are the main character art. The matching .mobile.webp files
are transparent, cropped, compressed versions of those same sources so phones do not
fall back to a wide/opaque image with a background.

The site displays these local files immediately, then tries the free SFW nekos.best
provider for online artwork. A remote result is only used when it can be fetched and
has enough transparency to behave as a character cut-out. Otherwise, the bundled local
image remains visible. The dominant visible colour is sampled from the displayed image
to theme the page. Internet access is optional; local artwork is the offline fallback.

To fetch updated art for the local set, run `node scripts/fetch-art.mjs --force`.
Only use artwork you have the rights to use. After replacing a desktop source, also
regenerate its matching `.mobile.webp` transparent cut-out from that source.
