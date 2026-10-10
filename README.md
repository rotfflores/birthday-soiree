# Birthday soirée

Portada y bienvenida de cumpleaños en HTML, CSS y JavaScript, sin dependencias. La paleta es marfil `#FFF8F0`, rosa empolvado `#D8A7B1` y cereza `#722F46`.

## Vista local

Desde esta carpeta ejecuta `npm run dev` y abre `http://127.0.0.1:4173`.

## Personalizar

Edita `dist/config.js`: `name`, `age`, `photo`, `photoAlt`, `music` y `musicVolume`. La fotografía actual es un retrato ficticio generado como muestra, no una fotografía de Valentina. Sustitúyela por una imagen vertical propia. El nombre se ajusta al espacio disponible cuando es largo.

La música es una pieza instrumental original de piano. Puede sustituirse por un archivo de audio autorizado en `dist/assets/`; actualiza `music` con su ruta. El audio tiene `preload="none"` y solo se reproduce tras pulsar **Estás invitado**. Después de abrir, el botón superior permite pausar o continuar la música. Regresar a la portada la pausa.

## Próximas secciones

Se han desarrollado únicamente la portada y la segunda sección de bienvenida con cuenta regresiva. La bienvenida ocupa `section#welcome` dentro de `main#invitation-content` y se revela al pulsar **Estás invitado**. Añade las futuras secciones después de `#welcome`. No se han agregado ubicación, RSVP ni detalles del evento.

## Cuenta regresiva

En `dist/config.js`, cambia `birthdayDate`. La fecha **de ejemplo** es `2026-11-14T20:00:00-06:00`: 14 de noviembre de 2026, 20:00, Ciudad de México. El desfase `-06:00` fija el instante para todos los visitantes, aunque estén en otra zona horaria. Usa una fecha ISO con `Z` o un desfase explícito. Esta fecha no se muestra como información del evento.

El contador calcula días, horas, minutos y segundos usando el reloj actual en cada actualización. Se inicia al abrir y se sincroniza al regresar de una pestaña inactiva. Al llegar a cero, se sustituye por **¡Hoy celebramos!**; nunca muestra números negativos. `npm run check` valida la lógica, el límite de cero y la zona horaria.

La bienvenida entra con un desvanecimiento suave al aparecer en pantalla y permanece visible sin animación si el dispositivo solicita movimiento reducido. Las copas y los dos destellos son ilustraciones SVG originales.

## Animación

- Llegada: el marco se traza, el arco del retrato se revela de abajo hacia arriba, el moño se dibuja a mano y el nombre aparece como tinta con un brillo satinado que pasa cada pocos segundos.
- Ambiente: luces cálidas que se desplazan lentamente, grano fino de película y partículas rosadas que flotan. Los destellos titilan y el retrato respira con un leve acercamiento.
- Interacción: en escritorio el retrato se inclina sutilmente con el cursor. El botón tiene un brillo de satén y un halo que invita a tocarlo.
- Apertura: un velo cereza se expande desde el botón con una estrella al centro y se disuelve sobre la bienvenida. La segunda sección entra con un desvanecimiento suave y las copas permanecen delicadas y estáticas. El botón de música pulsa mientras suena.
- Con `prefers-reduced-motion` todo esto se desactiva y la apertura es inmediata.

## Accesibilidad

Controles de teclado, foco visible, etiquetas de música, destino de foco después de abrir, `inert` durante la transición y respeto por `prefers-reduced-motion`. La portada usa `100svh` como altura mínima y permite desplazamiento cuando el espacio es insuficiente, sin recortar los elementos principales.

## Recursos

Fuentes alojadas en este proyecto: Cormorant Garamond y DM Sans (Google Fonts / SIL Open Font License). `ASSETS.md` conserva la procedencia del retrato y el prompt.
