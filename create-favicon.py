#!/usr/bin/env python3
from PIL import Image

# Cargar imagen
img = Image.open('public/buho-pandora.png')

# Crear versiones en diferentes tamaños para el .ico
icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
images = []

for size in icon_sizes:
    img_resized = img.resize(size, Image.Resampling.LANCZOS)
    images.append(img_resized)

# Guardar como .ico con múltiples tamaños
images[0].save('app/favicon.ico', format='ICO', sizes=[(img.width, img.height) for img in images], append_images=images[1:])
print('✅ Favicon creado: app/favicon.ico')
