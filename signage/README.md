# Window signage — AREA MOSA

Vector print files are in `out/print/` (text converted to outlines, no fonts needed).

| File | Purpose |
|------|---------|
| `top_manifest_MIRROR_for-print.{svg,pdf}` | Transom glass slogan, **mirrored** — send to print for application on the inside of the glass |
| `door_logo-hours-qr_MIRROR_for-print.{svg,pdf}` | Door: logo, PELUQUERÍA, hours, QR (https://area-mosa.com/), **mirrored** |
| `*_NORMAL_street-view.*` | Same artwork as seen from the street (reference / proof) |

Default artboards: top 1000 x 500 mm (the whole 2:1 pane), door ring diameter 200 mm. Both are vector, so resize freely.

Rebuild: `python3 src/export_print.py` (needs `fonttools uharfbuzz segno shapely` + Playwright). Content (hours, QR URL) lives in `src/door.py`; slogan in `src/designs.py`.
