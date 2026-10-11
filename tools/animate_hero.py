"""Create the looping menu GIF from our existing title art (Pillow required).

Only atmospheric layers move: drifting ground fog, rain/ash, and a slow green
light pulse. Cyclic functions and wrapped particles keep the six-second loop
continuous. The original PNG remains the static/reduced-motion fallback.
"""
from pathlib import Path
import math
import random
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
WIDTH, HEIGHT, COUNT = 1280, 512, 48
base = Image.open(ROOT / 'assets/title.png').convert('RGB').resize(
    (WIDTH, HEIGHT), Image.Resampling.NEAREST)
random.seed(2086)
particles = [(random.random(), random.random(), random.choice([1, 2]),
              random.randrange(70, 125)) for _ in range(85)]
frames = []
for frame in range(COUNT):
    phase = frame / COUNT
    angle = phase * math.tau
    # A low-resolution fog texture keeps the original pixel-art aesthetic.
    fog = Image.new('RGBA', (240, 96))
    fog_pixels = fog.load()
    for y in range(96):
        envelope = math.exp(-((y - 69) / 18) ** 2)
        for x in range(240):
            wave = (math.sin(x / 27 + angle + y / 8)
                    + math.sin(x / 17 - angle + y / 11) + 2) / 4
            fog_pixels[x, y] = (125, 162, 148, int(envelope * wave * 37))
    fog = fog.filter(ImageFilter.GaussianBlur(2)).resize(
        (WIDTH, HEIGHT), Image.Resampling.NEAREST)
    image = Image.alpha_composite(base.convert('RGBA'), fog)
    # Soft pools of light breathe, rather than flashing the entire image.
    glow = Image.new('RGBA', (240, 96))
    draw = ImageDraw.Draw(glow)
    for x, y, offset in [(180, 48, 0), (106, 37, 2), (49, 38, 4)]:
        alpha = int(10 + 9 * (1 + math.sin(angle + offset)) / 2)
        draw.ellipse((x - 9, y - 10, x + 9, y + 10), fill=(154, 202, 77, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(5)).resize(
        (WIDTH, HEIGHT), Image.Resampling.NEAREST)
    image = Image.alpha_composite(image, glow)
    atmosphere = Image.new('RGBA', image.size)
    draw = ImageDraw.Draw(atmosphere)
    for x, y, speed, opacity in particles:
        px = int(((x + phase * .08) % 1) * WIDTH)
        py = int(((y + phase * speed) % 1) * HEIGHT)
        fade = min(1, px / 30, (WIDTH - px) / 30, py / 20, (HEIGHT - py) / 20)
        draw.rectangle((px, py, px + 1, py + (3 if speed == 2 else 1)),
                       fill=(155, 183, 172, int(opacity * fade)))
    frames.append(Image.alpha_composite(image, atmosphere).convert('RGB'))

# Share a palette so stationary scenery doesn't shimmer between frames.
palette = frames[0].quantize(colors=256, method=Image.Quantize.MEDIANCUT)
indexed = [f.quantize(palette=palette, dither=Image.Dither.NONE) for f in frames]
destination = ROOT / 'assets/title-loop.gif'
indexed[0].save(destination, save_all=True, append_images=indexed[1:],
                duration=125, loop=0, optimize=True, disposal=1)
with Image.open(destination) as gif:
    assert gif.n_frames == COUNT and gif.info['loop'] == 0
    gif.seek(0)
    first = gif.convert('RGB').tobytes()
    gif.seek(COUNT // 2)
    assert gif.convert('RGB').tobytes() != first
print(f'{destination.name}: {COUNT} frames, 6 second infinite loop, '
      f'{destination.stat().st_size / 1024 / 1024:.2f} MB')
