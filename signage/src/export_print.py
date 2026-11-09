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
    subprocess.run(["node", os.path.join(HERE, "pdf.js"), sp, os.path.join(OUT, name + ".pdf"), f"{w_mm:g}", f"{h_mm:g}"], check=True)
    print(name, f"{w_mm:g} x {h_mm:g} мм")


def main():
    # верх: артборд = всё стекло 2:1
    t = v3(); dx, dy = t.centered_offset(bias=-4)
    for mirror, tag in ((False, "NORMAL_street-view"), (True, "MIRROR_for-print")):
        write(f"top_manifest_{tag}", t.svg(mirror=mirror, dx=dx, dy=dy, color=COLOR, width=f"{W}mm", height=f"{H}mm"), W, H)
    # дверь: масштаб, при котором кольцо Ø 200 мм
    c, _ = cluster()
    k, m = 200 / 300, 10
    bw, bh = c.right - c.left + 2 * m, c.bottom - c.top + 2 * m
    for mirror, tag in ((False, "NORMAL_street-view"), (True, "MIRROR_for-print")):
        svg = c.svg(mirror=mirror, dx=-c.left + m, dy=-c.top + m, view=(bw, bh), color=COLOR,
                    width=f"{bw * k:.1f}mm", height=f"{bh * k:.1f}mm")
        write(f"door_logo-hours-qr_{tag}", svg, round(bw * k, 1), round(bh * k, 1))


if __name__ == "__main__":
    main()
