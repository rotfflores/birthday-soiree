# Birthday soirée

Portada, bienvenida y detalles de la celebración en HTML, CSS y JavaScript, sin dependencias. La paleta es marfil `#FFF8F0`, rosa empolvado `#D8A7B1` y cereza `#722F46`.

## Vista local

Desde esta carpeta ejecuta `npm run dev` y abre `http://127.0.0.1:4173`.

También puedes abrir `dist/index.html` directamente. La tercera sección se ha desarrollado únicamente en los archivos locales; no se ha subido ni publicado.

## Personalizar

Edita `dist/config.js`: `name`, `age`, `photo`, `photoAlt`, `music` y `musicVolume`. La fotografía actual es un retrato ficticio generado como muestra, no una fotografía de Valentina. Sustitúyela por una imagen vertical propia. El nombre se ajusta al espacio disponible cuando es largo.

La música es una pieza instrumental original de piano. Puede sustituirse por un archivo de audio autorizado en `dist/assets/`; actualiza `music` con su ruta. El audio tiene `preload="none"` y solo se reproduce tras pulsar **Estás invitado**. Después de abrir, el botón superior permite pausar o continuar la música. Regresar a la portada la pausa.

## Próximas secciones

Se han desarrollado la portada, la bienvenida con cuenta regresiva y la tercera sección de fecha, hora y lugar. Las dos últimas están dentro de `main#invitation-content` y se revelan al pulsar **Estás invitado**. Los detalles ocupan `section#event-details`, después de `#welcome`. Añade futuras secciones después de `#event-details`. No se ha agregado RSVP ni otras secciones.

## Cuenta regresiva

En `dist/config.js`, cambia `birthdayDate`. La fecha **de ejemplo** es `2026-11-14T20:00:00-06:00`: 14 de noviembre de 2026, 20:00, Ciudad de México. El desfase `-06:00` fija el instante para todos los visitantes, aunque estén en otra zona horaria. Usa una fecha ISO con `Z` o un desfase explícito. La tercera sección y el calendario comparten esta misma fecha; no hay que actualizarla en el HTML.

El contador calcula días, horas, minutos y segundos usando el reloj actual en cada actualización. Se inicia al abrir y se sincroniza al regresar de una pestaña inactiva. Al llegar a cero, se sustituye por **¡Hoy celebramos!**; nunca muestra números negativos. `npm run check` valida la lógica, el límite de cero y la zona horaria.

La bienvenida entra con un desvanecimiento suave al aparecer en pantalla y permanece visible sin animación si el dispositivo solicita movimiento reducido. Las copas y los dos destellos son ilustraciones SVG originales.

## Fecha, hora y lugar

Configura estos campos en `dist/config.js`:

- `birthdayDate`: fecha y hora de inicio compartidas por el contador, la tercera sección y el calendario.
- `eventTimeZone`: zona IANA de la celebración, inicialmente `America/Mexico_City`. La hora se presenta en esta zona, independientemente de la zona del visitante. Si cambias de ciudad, ajusta también el desfase de `birthdayDate`.
- `venueName` y `venueAddress`: nombre del lugar y dirección completa. Admiten textos largos y saltos de línea. Inicialmente se muestra **Lugar por confirmar / Dirección por confirmar**.
- `mapsUrl`: enlace HTTPS editable de Google Maps. Si queda vacío y existe una dirección, se genera una búsqueda en Maps con el lugar y la dirección. Si ambos faltan, **Cómo llegar** conserva su diseño y permanece inactivo hasta configurarlo.
- `calendarDurationMinutes`: duración de ejemplo para el evento de calendario, inicialmente 180 minutos; no se muestra como hora de cierre en la invitación.

**Cómo llegar** abre Maps en una pestaña nueva. **Guardar en mi calendario** abre una plantilla de Google Calendar con el nombre, la fecha, la hora, la ubicación y la zona horaria configuradas; el invitado decide guardarla. Se emplean instantes UTC y los parámetros `stz`/`etz` de la [plantilla oficial de Google Calendar](https://developers.google.com/workspace/calendar/api/concepts/inviting-attendees-to-events#provide_a_link_for_users_to_add_the_event), para conservar el inicio incluso cuando cambia el día en UTC o hay cambio de horario.

La sección usa un fondo marfil, un borde cereza y un moño SVG. Aparece suavemente al desplazarse y se muestra sin animación cuando está activada la preferencia de movimiento reducido. `npm run check` verifica la sincronización, las zonas horarias, la codificación de enlaces y los datos inválidos.

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
