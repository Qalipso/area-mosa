"""Логотип «О» с чертой — векторная реконструкция эталона (src/logo_reference.jpg).
Внешний контур — окружность, внутренний — кривая с профилем толщины, измеренным по эталону
(толстые бока, волосяные верх и низ). На волосяных участках толщина поднимается до минимума,
пригодного для плёнки (min_hair * D), иначе линия тоньше 0.3 мм не вырежется и не приклеится."""
import json, os, math

_P = json.load(open(os.path.join(os.path.dirname(__file__), "logo_profile.json")))
T = _P["t_over_R"]                       # толщина / R для 0..90°
BAR_LEN = _P["bar_len_px"] / (2 * _P["R_px"])   # длина черты в долях диаметра
BAR_TH = _P["bar_th_px"] / (2 * _P["R_px"])


def _t(theta_deg):
    d = theta_deg % 360
    if d > 180: d = 360 - d
    if d > 90: d = 180 - d
    i = int(d); f = d - i
    return T[i] * (1 - f) + T[min(i + 1, 90)] * f


def logo_geometry(cx, cy, D, min_hair=0.005, step=5):
    """-> (d контура кольца, (x, y, w, h) черты, bbox кольца)."""
    R = D / 2
    pts = []
    for k in range(0, 360, step):
        t = math.sqrt((_t(k) * R) ** 2 + (min_hair * D) ** 2)
        r = R - t
        a = math.radians(k)
        pts.append((cx + r * math.cos(a), cy - r * math.sin(a)))
    # замкнутый Catmull-Rom -> кубические Безье
    n = len(pts)
    d = f"M{pts[0][0]:.3f},{pts[0][1]:.3f}"
    for i in range(n):
        p0, p1, p2, p3 = pts[(i - 1) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f"C{c1[0]:.3f},{c1[1]:.3f} {c2[0]:.3f},{c2[1]:.3f} {p2[0]:.3f},{p2[1]:.3f}"
    d += "Z"
    outer = (f"M{cx-R:.3f},{cy:.3f}A{R:.3f},{R:.3f} 0 1 1 {cx+R:.3f},{cy:.3f}"
             f"A{R:.3f},{R:.3f} 0 1 1 {cx-R:.3f},{cy:.3f}Z")
    bar = (cx - BAR_LEN * D / 2, cy - BAR_TH * D / 2, BAR_LEN * D, BAR_TH * D)
    return outer + d, bar, (cx - R, cy - R, cx + R, cy + R)
