"""Минимальный движок вёрстки: текст -> векторные контуры (SVG path).

Шейпинг через HarfBuzz (кернинг), контуры через fontTools.
Один источник и для превью, и для печатных файлов (шрифты не нужны на стороне типографии).
"""
import os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import uharfbuzz as hb

FONT_DIR = os.path.join(os.path.dirname(__file__), "..", "fonts")


class Face:
    def __init__(self, filename):
        path = os.path.join(FONT_DIR, filename)
        self.tt = TTFont(path)
        self.gs = self.tt.getGlyphSet()
        self.order = self.tt.getGlyphOrder()
        self.upem = self.tt["head"].unitsPerEm
        self.cmap = self.tt.getBestCmap()
        with open(path, "rb") as f:
            blob = hb.Blob(f.read())
        self.hbfont = hb.Font(hb.Face(blob))
        os2 = self.tt["OS/2"]
        self.cap = getattr(os2, "sCapHeight", 0) or int(self.upem * 0.7)
        self.xh = getattr(os2, "sxHeight", 0) or int(self.upem * 0.5)

    def has(self, ch):
        return ord(ch) in self.cmap


_cache = {}


def face(name):
    if name not in _cache:
        _cache[name] = Face(name)
    return _cache[name]


def pick(faces, ch):
    for f in faces:
        if f.has(ch):
            return f
    return faces[0]


def _runs(text, faces):
    runs, cur, curf = [], "", None
    for ch in text:
        f = pick(faces, ch) if ch != " " else (curf or faces[0])
        if curf is not None and f is not curf:
            runs.append((cur, curf))
            cur = ""
        cur += ch
        curf = f
    if cur:
        runs.append((cur, curf))
    return runs


def layout(text, faces, size, tracking=0.0):
    """Возвращает (glyphs, width). glyph = (face, glyph_name, x_offset_px, y_offset_px).
    tracking — в em (0.05 = +5% кегля)."""
    if isinstance(faces, Face):
        faces = [faces]
    glyphs, x = [], 0.0
    for run, f in _runs(text, faces):
        buf = hb.Buffer()
        buf.add_str(run)
        buf.guess_segment_properties()
        hb.shape(f.hbfont, buf, {"kern": True, "liga": False})
        k = size / f.upem
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            glyphs.append((f, f.order[info.codepoint], x + pos.x_offset * k, pos.y_offset * k))
            x += pos.x_advance * k + tracking * size
    width = x - tracking * size if glyphs else 0.0
    return glyphs, width


def measure(text, faces, size, tracking=0.0):
    return layout(text, faces, size, tracking)[1]


def text_path(text, faces, size, x, y, tracking=0.0, align="left"):
    """SVG path 'd' для строки. y — базовая линия. align: left|center|right (относительно x)."""
    glyphs, width = layout(text, faces, size, tracking)
    ox = x - (width / 2 if align == "center" else width if align == "right" else 0)
    ds = []
    for f, gname, gx, gy in glyphs:
        k = size / f.upem
        pen = SVGPathPen(f.gs, ntos=lambda v: ("%.2f" % v).rstrip("0").rstrip("."))
        tp = TransformPen(pen, (k, 0, 0, -k, ox + gx, y - gy))
        f.gs[gname].draw(tp)
        d = pen.getCommands()
        if d:
            ds.append(d)
    return " ".join(ds), width


def cap_height(faces, size):
    f = faces[0] if isinstance(faces, (list, tuple)) else faces
    return f.cap * size / f.upem


def fit_size(text, faces, target_width, tracking=0.0):
    w1 = measure(text, faces, 100, tracking)
    return 100 * target_width / w1


def wrap(text, faces, size, max_width, tracking=0.0):
    words, lines, cur = text.split(" "), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if cur and measure(t, faces, size, tracking) > max_width:
            lines.append(cur)
            cur = w
        else:
            cur = t
    if cur:
        lines.append(cur)
    return lines
