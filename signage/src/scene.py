"""Сцена: верхняя надпись + дверной блок на фото. Использование: scene.py <цвет_верха> <цвет_двери> <out.jpg>"""
import sys, os, subprocess, numpy as np, cv2
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from designs import v3, W, H
from door import cluster
import mockup

TMP = os.path.join(os.path.dirname(__file__), "..", "out", "tmp")
os.makedirs(TMP, exist_ok=True)
S = 3
TOP_RECT = (mockup.X0, mockup.Y0, mockup.X1, mockup.Y1)
K = 85 / 300.0           # px фото на единицу двери (кольцо Ø 85 px)


def clean_door(img):
    """Стирает старое белое лого/текст/QR: светлее локального фона и почти белое."""
    b, g, r = [img[..., i].astype(int) for i in range(3)]
    lum = (r + g + b) / 3.0
    local = cv2.GaussianBlur(lum.astype(np.float32), (0, 0), 14)
    m = ((np.minimum(np.minimum(r, g), b) > 170) & (lum - local > 14)).astype(np.uint8) * 255
    box = np.zeros_like(m); box[668:950, 338:482] = 255
    m = cv2.bitwise_and(m, box)
    m = cv2.dilate(m, np.ones((3, 3), np.uint8), iterations=4)
    filled = cv2.inpaint(img, m, 6, cv2.INPAINT_TELEA)
    bg = cv2.GaussianBlur(filled, (0, 0), 3.0)
    soft = cv2.GaussianBlur(m, (0, 0), 1.5).astype(float)[..., None] / 255.0
    return (img * (1 - soft) + bg * soft).astype(np.uint8)


def render(svg_text, w, h, name):
    sp, pp = os.path.join(TMP, name + ".svg"), os.path.join(TMP, name + ".png")
    open(sp, "w").write(svg_text)
    subprocess.run(["node", os.path.join(os.path.dirname(__file__), "render.js"), sp, pp, str(w), str(h)], check=True)
    return np.array(Image.open(pp).convert("RGBA"))


def paste(big, rgba, x, y, alpha):
    h, w = rgba.shape[:2]
    ox, oy = round(x * S), round(y * S)
    a = rgba[..., 3:4] / 255.0 * alpha
    roi = big[oy:oy + h, ox:ox + w].astype(float)
    col = rgba[..., :3][..., ::-1].astype(float)
    big[oy:oy + h, ox:ox + w] = (roi * (1 - a) + col * a).astype(np.uint8)


def build(top_color, door_color, out, alpha=0.95, top_design=v3):
    bgr = cv2.imread(mockup.PHOTO)
    bgr = clean_door(mockup.clean(bgr))
    big = cv2.resize(bgr, None, fx=S, fy=S, interpolation=cv2.INTER_LANCZOS4)
    # верх
    t = top_design(); dx, dy = t.centered_offset(bias=-4)
    pw, ph = round((TOP_RECT[2] - TOP_RECT[0]) * S), round((TOP_RECT[3] - TOP_RECT[1]) * S)
    paste(big, render(t.svg(dx=dx, dy=dy, color=top_color, width=pw, height=ph), pw, ph, "top"), TOP_RECT[0], TOP_RECT[1], alpha)
    # дверь
    c, _ = cluster()
    bw, bh = c.right - c.left, c.bottom - c.top
    w, h = round(bw * K * S), round(bh * K * S)
    svg = c.svg(dx=-c.left, dy=-c.top, view=(bw, bh), width=w, height=h, color=door_color)
    paste(big, render(svg, w, h, "door"), 408 - bw * K / 2, 682.5, alpha)
    cv2.imwrite(out, big[int(300 * S):int(1120 * S), int(100 * S):int(620 * S)], [cv2.IMWRITE_JPEG_QUALITY, 92])


if __name__ == "__main__":
    build(sys.argv[1], sys.argv[2], sys.argv[3])
