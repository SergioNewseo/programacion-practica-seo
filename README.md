# Freepik Product Studio

Aplicación web (HTML/CSS/JS) para transformar imágenes de producto en composiciones profesionales con la API de Freepik.

## Funcionalidades

- Campo seguro para API Key (se envía como `Authorization: Bearer ...`).
- Carga local de imagen de producto y conversión a Data URI para `image_reference`.
- Configuración de:
  - Aspect ratio (`1:1`, `4:5`, `16:9`)
  - Modelo (`freepik-mystic-v2`, `freepik-v1`)
  - Número de imágenes (`1` a `4`)
  - Fuerza de referencia (`image_reference_strength`)
- Prompt libre para describir contexto creativo.
- Galería de resultados con vista ampliada y descarga.

## Uso

1. Abre `index.html` en el navegador.
2. Introduce tu API Key de Freepik.
3. Sube la imagen del producto.
4. Elige formato/modelo/cantidad y ajusta la fuerza de referencia.
5. Escribe el prompt creativo y pulsa **Generar imágenes**.

> Nota: este proyecto asume el endpoint `POST /v1/ai/text-to-image` y envía `image_reference` en formato Data URI.
