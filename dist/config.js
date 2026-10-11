// Personaliza la invitación aquí. No es necesario cambiar HTML ni CSS.
window.BIRTHDAY_CONFIG = Object.freeze({
  name: "Valentina",
  age: 28,
  // FECHA DE EJEMPLO: 14 de noviembre de 2026, 20:00, Ciudad de México (UTC−06:00).
  // Cambia la fecha y hora, manteniendo el formato ISO y el desfase de zona horaria.
  birthdayDate: "2026-11-14T20:00:00-06:00",
  // La tercera sección y el calendario usan birthdayDate, igual que la cuenta regresiva.
  // Si cambias de ciudad, ajusta también el desfase ISO de birthdayDate.
  eventTimeZone: "America/Mexico_City",
  // LUGAR DE EJEMPLO (inventado): sustitúyelo por el lugar real.
  venueName: "Casa Rosé · Terraza y Jardín",
  venueAddress: "Av. Álvaro Obregón 185, Roma Norte, Cuauhtémoc, 06700 Ciudad de México, CDMX", // Escribe aquí la dirección completa.
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+%C3%81lvaro+Obreg%C3%B3n+185%2C+Roma+Norte%2C+Cuauht%C3%A9moc%2C+06700+Ciudad+de+M%C3%A9xico%2C+CDMX", // Pega el enlace de Google Maps. Si queda vacío, se busca venueAddress.
  calendarDurationMinutes: 180, // Duración de ejemplo, solo para el calendario; personalizable.
  // Código de vestimenta (cuarta sección). Cambia la indicación, la explicación y la nota de color.
  dressCode: "Cóctel",
  dressCodeDescription: "Vestido, conjunto elegante o camisa con pantalón de vestir. Elige un look que te haga sentir increíble y te permita disfrutar la noche.",
  dressCodeColorNote: "Ven del color que más te guste.",
  // Confirmación de asistencia (quinta sección). La respuesta solo se muestra en pantalla; no se envía a ningún lado.
  rsvpDeadline: "2026-11-01", // Fecha límite (AAAA-MM-DD). También puedes escribir un texto, por ejemplo "1 de noviembre".
  // Galería de Polaroids (antes de la despedida). Sustituye cada foto por la tuya
  // (de preferencia cuadrada) y escribe su frase. Puedes poner más o menos fotos.
  galleryTitle: "Momentos que me hacen sonreír",
  galleryText: "Un poquito de mí, antes de compartir una noche contigo.",
  galleryPhotos: [
    { src: "assets/gallery/foto-1.webp", caption: "Siempre lista para celebrar", alt: "Retrato de muestra sonriendo" },
    { src: "assets/gallery/foto-2.webp", caption: "Mañanas de café", alt: "Taza de café sobre una mesa de madera" },
    { src: "assets/gallery/foto-3.webp", caption: "Mi compañía favorita", alt: "Gato atigrado mirando a la cámara" },
    { src: "assets/gallery/foto-4.webp", caption: "Soñar en grande", alt: "Cielo lleno de estrellas y galaxias" },
    { src: "assets/gallery/foto-5.webp", caption: "Nuevas aventuras", alt: "Cohete listo para despegar al anochecer" },
    { src: "assets/gallery/foto-6.webp", caption: "Una vuelta más al sol", alt: "Retrato de muestra en primer plano" },
  ],
  // Despedida (sexta sección). La firma usa "name".
  farewellTitle: "Lo mejor será compartirlo contigo",
  farewellText: "Una nueva vuelta al sol, muchos deseos por cumplir y una noche para crear recuerdos con las personas que quiero.",
  farewellHighlight: "¡Nos vemos para celebrar!",
  farewellSignOff: "Con cariño,",
  photo: "assets/portrait.webp",
  photoAlt: "Retrato de muestra para la invitación de Valentina",
  // Sustituye este archivo por tu canción. Usa un archivo local o una URL HTTPS.
  music: "assets/soiree.mp3",
  musicVolume: 0.35,
});
