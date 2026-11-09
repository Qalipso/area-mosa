"""Три варианта надписи для верхнего стекла. Холст — 1000 x 500 (пропорция 2:1, как у стекла).
Всё векторное: текст переведён в кривые, линии — закрытые прямоугольники (удобно для плоттера)."""
import sys
sys.path.insert(0, __import__("os").path.dirname(__file__))
from typeset import face, text_path, measure, wrap, cap_height

W, H = 1000, 500
RED = "#DC1F26"

SB = [face("InterDisplay-SemiBold.otf")]
MD = [face("InterDisplay-Medium.otf")]
LT = [face("InterDisplay-Light.otf")]
SERIF_IT = [face("Cormorant-latin-500-italic.ttf"), face("Cormorant-cyrillic-500-italic.ttf")]

ES = ("NO SOMOS COMO LOS DEMÁS.", "Y ESTÁ BIEN.")
EN = ("WE’RE NOT LIKE EVERYONE ELSE.", "AND THAT’S OK.")
RU = ("МЫ НЕ КАК ВСЕ.", "И ЭТО НОРМАЛЬНО.")


class Canvas:
    def __init__(self):
        self.items = []  # ('path', d) | ('rect', x, y, w, h)
        self.top, self.bottom, self.left, self.right = 1e9, -1e9, 1e9, -1e9

    def _bb(self, x0, y0, x1, y1):
        self.top, self.bottom = min(self.top, y0), max(self.bottom, y1)
        self.left, self.right = min(self.left, x0), max(self.right, x1)

    def text(self, s, faces, size, x, y, tracking=0.0, align="left", lower=0.0):
        d, w = text_path(s, faces, size, x, y, tracking, align)
        self.items.append(("path", d))
        x0 = x - (w / 2 if align == "center" else w if align == "right" else 0)
        self._bb(x0, y - cap_height(faces, size), x0 + w, y + lower)
        return w

    def rect(self, x, y, w, h):
        self.items.append(("rect", x, y, w, h))
        self._bb(x, y, x + w, y + h)

    def svg(self, mirror=False, dx=0, dy=0, bg=None, width=None, height=None, extra=""):
        out = []
        for it in self.items:
            if it[0] == "path":
                out.append(f'<path d="{it[1]}"/>')
            else:
                out.append(f'<rect x="{it[1]:.2f}" y="{it[2]:.2f}" width="{it[3]:.2f}" height="{it[4]:.2f}"/>')
        g = f'<g fill="{RED}" transform="translate({dx:.2f},{dy:.2f})">' + "".join(out) + "</g>"
        if mirror:
            g = f'<g transform="translate({W},0) scale(-1,1)">{g}</g>'
        wh = f' width="{width}" height="{height}"' if width else ""
        bgr = f'<rect width="{W}" height="{H}" fill="{bg}"/>' if bg else ""
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"{wh}>{bgr}{g}{extra}</svg>')

    def centered_offset(self, bias=0.0):
        """Сдвиг, чтобы блок встал по центру стекла (bias<0 — чуть выше центра)."""
        return ((W - (self.left + self.right)) / 2, (H - (self.top + self.bottom)) / 2 + bias)


# ---------------------------------------------------------------- V1: иерархия
def v1():
    c = Canvas()
    x0, y = 80, 0
    s1, tr = 47, 0.03
    cap = cap_height(SB, s1)
    # ES — главный язык, крупно
    wES = c.text(ES[0], SB, s1, x0, y + cap, tr)
    c.text(ES[1], LT, s1, x0, y + cap + s1 * 1.22, tr + 0.02)
    y_rule = y + cap + s1 * 1.22 + 40
    c.rect(x0, y_rule, wES, 3)
    # EN / RU — второстепенные, в две колонки; кегль подобран так, чтобы EN встал в одну строку
    # и обе колонки вместе дали ровно ширину ES-строки
    gap = 44
    w100 = lambda t, f, tr_: measure(t, f, 100, tr_)
    tr2 = 0.035
    wen = w100(EN[0], SB, tr2)
    wru = max(w100(RU[0], SB, tr2), w100(RU[1], LT, tr2 + 0.02))
    s2 = 100 * (wES - gap) / (wen + wru)
    cap2 = cap_height(SB, s2)
    xs = (x0, x0 + measure(EN[0], SB, s2, tr2) + gap)
    for x, (st, pu) in zip(xs, (EN, RU)):
        yb = y_rule + 3 + 34 + cap2
        c.text(st, SB, s2, x, yb, tr2)
        c.text(pu, LT, s2, x, yb + s2 * 1.3, tr2 + 0.02)
    return c


# ---------------------------------------------------------------- V2: строки (швейцарская сетка)
def v2():
    c = Canvas()
    x_tag, x_txt = 80, 190
    s, tr, lead = 33, 0.03, 1.24
    cap = cap_height(SB, s)
    row_h = cap + s * lead
    gap = 48
    y = 0
    rows = (("ES", ES), ("EN", EN), ("RU", RU))
    wmax = max(measure(r[1][0], SB, s, tr) for r in rows)
    for i, (tag, (st, pu)) in enumerate(rows):
        c.text(tag, MD, 12.5, x_tag, y + cap, 0.28)
        c.text(st, SB, s, x_txt, y + cap, tr)
        c.text(pu, LT, s, x_txt, y + cap + s * lead, tr + 0.02)
        y += row_h
        if i < 2:
            c.rect(x_tag, y + gap / 2 - 1, x_txt - x_tag + wmax, 2.4)
            y += gap
    return c


# ---------------------------------------------------------------- V3: манифест по центру
def v3():
    c = Canvas()
    cx = W / 2
    s1, tr = 58, 0.03
    cap = cap_height(SB, s1)
    y = 0
    # ES — две строки
    for ln in ("NO SOMOS COMO", "LOS DEMÁS."):
        c.text(ln, SB, s1, cx, y + cap, tr, "center")
        y += s1 * 1.16
    # punchline — курсивная антиква, в тон сайту
    sp = 92
    c.text("y está bien.", SERIF_IT, sp, cx, y + 20 + cap_height(SERIF_IT, sp) * 0.9, 0.0, "center", lower=sp * 0.22)
    y += 20 + sp * 0.9 + 28
    c.rect(cx - 22, y, 44, 3)
    y += 3 + 34
    s2, tr2 = 19, 0.07
    cap2 = cap_height(MD, s2)
    c.text(" ".join(EN), MD, s2, cx, y + cap2, tr2, "center")
    c.text(" ".join(RU), MD, s2, cx, y + cap2 + s2 * 1.9, tr2, "center")
    return c


DESIGNS = {"v1_ierarhiya": v1, "v2_stroki": v2, "v3_manifest": v3}

if __name__ == "__main__":
    import os
    out = os.path.join(os.path.dirname(__file__), "..", "out")
    for name, fn in DESIGNS.items():
        c = fn()
        dx, dy = c.centered_offset(bias=-4)
        print(name, "bbox w=%.0f h=%.0f (%.0f%% x %.0f%% панели)" % (
            c.right - c.left, c.bottom - c.top, 100 * (c.right - c.left) / W, 100 * (c.bottom - c.top) / H))
        with open(os.path.join(out, f"preview_{name}.svg"), "w") as f:
            f.write(c.svg(dx=dx, dy=dy, bg="#F3EEE6", width=1500, height=750))
