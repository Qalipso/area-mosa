# Window signage — AREA MOSA

Vector print files are in `out/print/` (text converted to outlines, no fonts needed).

| File | Purpose |
|------|---------|
| `door_450x650mm_MIRROR_for-print_{sand,white}.{svg,pdf}` | Door film 45 x 65 cm: logo O (Ø 17 cm), PELUQUERÍA (32 cm), hours (15 cm), QR 6x6 cm (https://area-mosa.com/), **mirrored** — for application on the inside of the glass |
| `top_1200x600mm_NORMAL_{sand,white}.{svg,pdf}` | Transom glass slogan 120 x 60 cm, **not mirrored yet** (set `MIRROR_TOP = True` in `src/export_print.py` for the print version) |
| `*_NORMAL_street-view.*` | Same artwork as seen from the street (reference / proof) |

PDFs are pure vector (text outlined, page size exact in mm). Logo is a vector reconstruction of `src/logo_reference.jpg` (`src/logo.py`).

Rebuild: `python3 src/export_print.py` (needs `fonttools uharfbuzz segno shapely cairosvg` + Playwright for previews). Content (hours, QR URL) lives in `src/door.py`; slogan in `src/designs.py`.
