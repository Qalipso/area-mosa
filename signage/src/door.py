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

DM_R = [face("DMSans-latin-400.ttf")]
DM_M = [face("DMSans-latin-500.ttf")]
DM_L = [face("DMSans-latin-300.ttf")]

# ---- содержимое (проверить перед печатью!) ----
HOURS_TITLE = "HORARIO"
HOURS_DAYS = "LUN – SÁB"
HOURS_TIME = "10:00 – 20:00"
QR_URL = "https://wa.me/59892122029"   # номер с сайта; в CLAUDE.md указан другой (+598 94 786877)


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


def cluster(qr_size=190):
    c = Canvas()
    cx, D = 500, 300
    R = D / 2
    ring(c, cx, R, R, stroke=9)
    # черта внутри кольца — как на сайте: отступ 14% с каждой стороны
    c.rect(cx - D * 0.36, R - 2.5, D * 0.72, 5)
    # PELUQUERÍA — широкий трекинг, ширина ≈ 1.5 диаметра
    tr = 0.22
    size = fit_size("PELUQUERÍA", DM_R, 450, tr)
    y = D + 100 + cap_height(DM_R, size)
    c.text("PELUQUERÍA", DM_R, size, cx, y, tr, "center")
    # часы
    y += 135
    s1 = 27
    c.text(HOURS_TITLE, DM_M, s1, cx, y, 0.16, "center")
    y += 62
    s2 = 33
    c.text(HOURS_DAYS, DM_R, s2, cx, y, 0.07, "center")
    y += 52
    c.text(HOURS_TIME, DM_R, s2, cx, y, 0.07, "center")
    # QR
    y += 80
    d, n = qr_path(QR_URL, cx - qr_size / 2, y, qr_size)
    c.raw(d, (cx - qr_size / 2, y, cx + qr_size / 2, y + qr_size))
    return c, n


if __name__ == "__main__":
    c, n = cluster()
    print("bbox: x %.0f..%.0f  y %.0f..%.0f   QR %dx%d модулей" % (c.left, c.right, c.top, c.bottom, n, n))
