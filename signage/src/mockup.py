"""Накладывает превью на фото двери: старая надпись зачищается (inpaint), новая кладётся на стекло."""
import sys, subprocess, numpy as np, cv2
from PIL import Image
PHOTO = "/tmp/claude-0/-home-user-area-mosa/a89bc1dc-25f1-5869-b81e-a469e7c0528b/images/1.jpg"
X0, Y0, X1, Y1 = 150.7, 340.7, 561.7, 546.7      # стекло в координатах фото
S = 3

def clean(img):
    """Стирает старую надпись: пиксели текста заменяются крупным медианным фоном (текстура потолка сохраняется)."""
    b, g, r = [img[..., i].astype(int) for i in range(3)]
    m = ((r - g > 62) & (r - b > 62)).astype(np.uint8) * 255
    m[:, :int(X0)+6] = 0; m[:, 470:] = 0; m[:int(Y0)+6] = 0; m[int(Y1)-6:] = 0
    m = cv2.dilate(m, np.ones((3, 3), np.uint8), iterations=5)
    filled = cv2.inpaint(img, m, 5, cv2.INPAINT_TELEA)
    bg = cv2.GaussianBlur(filled, (0, 0), 2.5)
    soft = cv2.GaussianBlur(m, (0, 0), 1.5).astype(float)[..., None] / 255.0
    return (img * (1 - soft) + bg * soft).astype(np.uint8)

def compose(design_png, out):
    bgr = cv2.imread(PHOTO)
    bgr = clean(bgr)
    big = cv2.resize(bgr, None, fx=S, fy=S, interpolation=cv2.INTER_LANCZOS4)
    rgba = np.array(Image.open(design_png).convert("RGBA").resize((round((X1-X0)*S), round((Y1-Y0)*S)), Image.LANCZOS))
    ox, oy = round(X0*S), round(Y0*S)
    h, w = rgba.shape[:2]
    a = (rgba[..., 3:4] / 255.0) * 0.93
    roi = big[oy:oy+h, ox:ox+w].astype(float)
    red = rgba[..., :3][..., ::-1].astype(float)
    big[oy:oy+h, ox:ox+w] = (roi * (1 - a) + red * a).astype(np.uint8)
    # кроп на верхнюю часть двери
    cv2.imwrite(out, big[int(300*S):int(640*S), int(100*S):int(620*S)], [cv2.IMWRITE_JPEG_QUALITY, 92])

if __name__ == "__main__":
    compose(sys.argv[1], sys.argv[2])
