# Birthday soirée

Portada de cumpleaños en HTML, CSS y JavaScript, sin dependencias. La paleta es marfil `#FFF8F0`, rosa empolvado `#D8A7B1` y cereza `#722F46`.

## Vista local

Desde esta carpeta ejecuta `npm run dev` y abre `http://127.0.0.1:4173`.

## Personalizar

Edita `dist/config.js`: `name`, `age`, `photo`, `photoAlt`, `music` y `musicVolume`. La fotografía actual es un retrato ficticio generado como muestra, no una fotografía de Valentina. Sustitúyela por una imagen vertical propia. El nombre se ajusta al espacio disponible cuando es largo.

La música es una pieza instrumental original de piano. Puede sustituirse por un archivo de audio autorizado en `dist/assets/`; actualiza `music` con su ruta. El audio tiene `preload="none"` y solo se reproduce tras pulsar **Estás invitado**. Después de abrir, el botón superior permite pausar o continuar la música. Regresar a la portada la pausa.

## Próximas secciones

Solo se ha desarrollado la portada. El `main#invitation-content` contiene una firma mínima con nombre y edad como destino de la transición. Añade las futuras secciones en `#invitation-slot` dentro de ese `main`. El evento `invitation:opened` permite conectar comportamiento adicional. No hay fecha, ubicación, RSVP ni otras secciones inventadas.

## Accesibilidad

Controles de teclado, foco visible, etiquetas de música, destino de foco después de abrir, `inert` durante la transición y respeto por `prefers-reduced-motion`. La portada usa `100svh` como altura mínima y permite desplazamiento cuando el espacio es insuficiente, sin recortar los elementos principales.

## Recursos

Fuentes alojadas en este proyecto: Cormorant Garamond y DM Sans (Google Fonts / SIL Open Font License). `ASSETS.md` conserva la procedencia del retrato y el prompt.
