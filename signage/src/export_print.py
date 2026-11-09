"""Печатные файлы. Единица = 1 мм при масштабе по умолчанию (верх 1000x500 мм, кольцо двери Ø 200 мм).
Файлы векторные: масштабируются без потерь. *_MIRROR — для наклейки с обратной стороны стекла."""
import os, sys, subprocess
sys.path.insert(0, os.path.dirname(__file__))
from designs import v3, W, H
from door import cluster

COLOR = "#D4C4A0"
OUT = os.path.join(os.path.dirname(__file__), "..", "out", "print")
os.makedirs(OUT, exist_ok=True)
HERE = os.path.dirname(__file__)


def write(name, svg, w_mm, h_mm):
    sp = os.path.join(OUT, name + ".svg")
    open(sp, "w").write(svg)
    import cairosvg   # точный размер страницы в мм, чистый вектор
    cairosvg.svg2pdf(url=sp, write_to=os.path.join(OUT, name + ".pdf"))
    print(name, f"{w_mm:g} x {h_mm:g} мм")


def main():
    # верх: стекло 1200 x 600 мм (120 x 60 см), композиция по центру
    t = v3(); dx, dy = t.centered_offset(bias=-4)
    for mirror, tag in ((False, "NORMAL_street-view"), (True, "MIRROR_for-print")):
        for cname, col in (("sand", COLOR), ("white", "#FFFFFF")):
            write(f"top_1200x600mm_{tag}_{cname}", t.svg(mirror=mirror, dx=dx, dy=dy, color=col, width="1200mm", height="600mm"), 1200, 600)
    # дверь: плёнка 450 x 650 мм, композиция по центру
    from door import ART_W, ART_H
    c, _ = cluster()
    dy = (ART_H - (c.top + c.bottom)) / 2
    for mirror, tag in ((False, "NORMAL_street-view"), (True, "MIRROR_for-print")):
        for cname, col in (("sand", COLOR), ("white", "#FFFFFF")):
            svg = c.svg(mirror=mirror, dx=0, dy=dy, view=(ART_W, ART_H), color=col, width=f"{ART_W}mm", height=f"{ART_H}mm")
            write(f"door_450x650mm_{tag}_{cname}", svg, ART_W, ART_H)


if __name__ == "__main__":
    main()
