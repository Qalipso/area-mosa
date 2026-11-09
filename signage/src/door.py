"""Дверь: лого (кольцо с чертой, как O-mark на сайте) + PELUQUERÍA + часы + QR.
Единицы: диаметр кольца = 300. Ось симметрии x = cx."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import segno
from shapely.geometry import box
from shapely.ops import unary_union
from shapely.geometry.polygon import orient
from typeset import face, measure, fit_size, cap_height
from designs import Canvas
from logo import logo_geometry

DM_R = [face("DMSans-latin-400.ttf")]
DM_M = [face("DMSans-latin-500.ttf")]
DM_L = [face("DMSans-latin-300.ttf")]

# ---- содержимое (проверить перед печатью!) ----
HOURS_TITLE = "HORARIO"
HOURS_DAYS = "LUN – DOM"
HOURS_TIME = "11:00 – 20:00"
QR_URL = "https://area-mosa.com/"


def ring(c, cx, cy, R, stroke):
    r = R - stroke
    d = (f"M{cx-R:.2f},{cy:.2f}A{R},{R} 0 1 1 {cx+R:.2f},{cy:.2f}A{R},{R} 0 1 1 {cx-R:.2f},{cy:.2f}Z"
         f"M{cx-r:.2f},{cy:.2f}A{r},{r} 0 1 0 {cx+r:.2f},{cy:.2f}A{r},{r} 0 1 0 {cx-r:.2f},{cy:.2f}Z")
    c.raw(d, (cx - R, cy - R, cx + R, cy + R))


def qr_path(url, x, y, size, quiet_ec="m"):
    """QR одним контуром (union модулей): без двойных резов для плоттера."""
    m = segno.make(url, error=quiet_ec, boost_error=False).matrix
    n = len(m)
    u = size / n
    boxes = [box(x + j * u, y + i * u, x + (j + 1) * u, y + (i + 1) * u)
             for i, row in enumerate(m) for j, v in enumerate(row) if v]
    geo = unary_union(boxes)
    polys = [geo] if geo.geom_type == "Polygon" else list(geo.geoms)
    ds = []
    for p in polys:
        p = orient(p, 1.0)
        for ringc in [p.exterior] + list(p.interiors):
            pts = list(ringc.coords)[:-1]
            ds.append("M" + "L".join(f"{a:.3f},{b:.3f}" for a, b in pts) + "Z")
    return "".join(ds), n


ART_W, ART_H = 450, 650          # плёнка 45 x 65 см (правая створка двери ≈ 90 см шириной)


def cluster(D=170, word_w=320, hours_w=150, qr_size=60, art_w=ART_W):
    """Единицы — миллиметры. Размеры по рекомендации: кольцо Ø 16–18 см, PELUQUERÍA 30–34 см,
    часы 15–20 см, QR 6x6 см. Композиция строится от верха кольца, ось симметрии x = art_w/2."""
    c = Canvas()
    cx, R = art_w / 2, D / 2
    # логотип «О» с чертой — по эталону (src/logo_reference.jpg), см. logo.py
    d, (bx, by, bw, bh), bb = logo_geometry(cx, R, D)
    c.raw(d, bb)
    c.rect(bx, by, bw, bh)
    # PELUQUERÍA — широкий трекинг
    tr = 0.22
    sw = fit_size("PELUQUERÍA", DM_R, word_w, tr)
    y = D + 45 + cap_height(DM_R, sw)
    c.text("PELUQUERÍA", DM_R, sw, cx, y, tr, "center")
    # часы
    s2 = fit_size(HOURS_TIME, DM_R, hours_w, 0.07)
    s1 = s2 * 0.62
    y += 70 + cap_height(DM_M, s1)
    c.text(HOURS_TITLE, DM_M, s1, cx, y, 0.16, "center")
    y += 30 + cap_height(DM_R, s2)
    c.text(HOURS_DAYS, DM_R, s2, cx, y, 0.07, "center")
    y += s2 * 1.55
    c.text(HOURS_TIME, DM_R, s2, cx, y, 0.07, "center")
    # QR
    y += 50
    dq, n = qr_path(QR_URL, cx - qr_size / 2, y, qr_size)
    c.raw(dq, (cx - qr_size / 2, y, cx + qr_size / 2, y + qr_size))
    return c, n


if __name__ == "__main__":
    c, n = cluster()
    print("bbox мм: x %.0f..%.0f  y %.0f..%.0f (высота %.0f)  QR %dx%d модулей" % (c.left, c.right, c.top, c.bottom, c.bottom - c.top, n, n))
