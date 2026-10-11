# Recursos de la portada

- `dist/assets/portrait.webp`: retrato ficticio generado con la herramienta integrada ImageGen. Es una imagen de muestra para reemplazar por la fotografía de la festejada.
- `dist/assets/soiree.mp3`: composición original de piano sintetizada con `scripts/create-music.mjs` y codificada en MP3 con FFmpeg. Duración: 40 segundos, reproducción en bucle.
- `Cormorant Garamond` y `DM Sans`: descargadas de Google Fonts y alojadas localmente; licencias SIL OFL incluidas junto a las fuentes.
- `dist/assets/watercolor.webp`: fondo de acuarela rosa empolvado proporcionado por Obed (en móvil y pantallas verticales). `watercolor-tl.webp` y `watercolor-br.webp` son recortes de sus esquinas para pantallas horizontales.
- Ilustraciones del código de vestimenta (vestido, camisa y pantalón): iconos “thin” de Phosphor Icons 2.1.1 (`@phosphor-icons/core`), licencia MIT en `dist/assets/LICENSE-Phosphor.txt`. Están incrustados como SVG en `index.html`.
- Moño, destellos e iconos: SVG originales en el HTML.

## Prompt del retrato (herramienta integrada, sin CLI)

Use case: photorealistic-natural. Asset type: vertical portrait photograph for a refined birthday invitation, cropped by the website into an arch. Create a believable editorial photograph of a fictional 28-year-old Latina woman with long dark brown softly wavy hair, natural makeup, a relaxed warm smile, in a simple elegant dark cherry satin sleeveless evening dress with fine straps, delicate small gold earrings. Waist-up portrait, body angled subtly, face looking toward camera, both shoulders fully within frame, head centered horizontally and located around one third from top so an arch crop keeps her face intact. Pale warm cream studio backdrop with natural soft late afternoon window light, subtle realistic skin and fabric texture, a touch of film grain, warm muted elegant aesthetic. Vertical 2:3 composition. Real photographic look, authentic and understated. No text, no logos, no border, no arch drawn into the image, no props, no decorations.

## Galería de Polaroids (`dist/assets/gallery/`)

Fotos de muestra para reemplazar por las de la festejada. Se recortaron en cuadrado (720 × 720), con un tono cálido suave, y se guardaron en WebP. Las cuatro fotos reales vienen de las imágenes de muestra que incluye scikit-image 0.26 (`skimage/data`), cada una con licencia libre:

- `foto-1.webp` y `foto-6.webp`: recortes del retrato ficticio `portrait.webp` (generado, ver arriba).
- `foto-2.webp`: taza de café (`coffee.png`), foto de Rachel Michetti, cortesía de Pikolo Espresso Bar. CC0.
- `foto-3.webp`: gata Chelsea (`chelsea.png`), foto de Stefan van der Walt. CC0.
- `foto-4.webp`: Hubble eXtreme Deep Field (`hubble_deep_field.jpg`), NASA. Dominio público.
- `foto-5.webp`: lanzamiento de DSCOVR en Falcon 9 (`rocket.jpg`), SpaceX. Dominio público.
