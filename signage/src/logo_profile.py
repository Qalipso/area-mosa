"""Измеряет профиль толщины буквы «О» по эталону (src/logo_reference.jpg) и сохраняет src/logo_profile.json.
Контур = внешняя окружность R минус внутренняя кривая r_in(theta) = R - t(theta). Толщина считается интегралом
яркости вдоль луча, поэтому волосяные линии <1 px не теряются."""
import json, os, numpy as np, cv2
HERE = os.path.dirname(__file__)
im = cv2.imread(os.path.join(HERE, "logo_reference.jpg"), 0).astype(np.float32)
CX, CY, R = 626.5, 627.0, 292.7
rs = np.arange(225, 300, 0.2)

def thick(th):
    xs = (CX + rs * np.cos(th)).astype(np.float32).reshape(1, -1)
    ys = (CY - rs * np.sin(th)).astype(np.float32).reshape(1, -1)
    v = cv2.remap(im, xs, ys, cv2.INTER_CUBIC)[0]
    a = np.clip((v - 55) / (240 - 55), 0, 1)
    return a.sum() * 0.2

deg = np.arange(0, 360, 1.0)
t = np.array([thick(np.radians(d)) for d in deg])
# сворачиваем по симметрии в 0..90°
fold = np.zeros(91)
for k in range(91):
    ang = [k, 180 - k, 180 + k, (360 - k) % 360]
    fold[k] = np.mean([t[int(a) % 360] for a in ang])
# лучи 0..2° задеты чертой (она лежит на оси) — восстанавливаем по соседним углам: t = a + b*theta^2
th = np.arange(3, 13); A = np.vstack([np.ones_like(th, dtype=float), th.astype(float) ** 2]).T
a_, b_ = np.linalg.lstsq(A, fold[3:13], rcond=None)[0]
fold[:3] = a_ + b_ * np.arange(3) ** 2
# сглаживание (окно 5°), монотонное убывание от боков к верху
pad = np.concatenate([fold[2:0:-1], fold, fold[-2:-4:-1]])
sm = np.convolve(pad, np.ones(5) / 5, mode="valid")
sm = np.minimum.accumulate(sm)
prof = {"R_px": R, "bar_len_px": 473, "bar_th_px": 6.0, "t_over_R": [float(x / R) for x in sm]}
json.dump(prof, open(os.path.join(HERE, "logo_profile.json"), "w"))
print("t(0)=%.1f t(45)=%.1f t(90)=%.2f px" % (sm[0], sm[45], sm[90]))
