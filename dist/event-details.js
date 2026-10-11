// Script clásico para funcionar tanto en la vista local como al abrir index.html.
((root) => {
  "use strict";

  const calendarStamp = (timestamp) => new Date(timestamp).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

  function getEventDetails(config) {
    // Exige un instante explícito: la zona del visitante no debe cambiar la cita.
    if (!/(?:Z|[+-]\d{2}:\d{2})$/i.test(config.birthdayDate || "")) return null;
    const start = Date.parse(config.birthdayDate);
    if (!Number.isFinite(start)) return null;
    const timeZone = config.eventTimeZone || "America/Mexico_City";
    try {
      const date = new Date(start);
      const parts = Object.fromEntries(new Intl.DateTimeFormat("es-MX", {
        timeZone, day: "2-digit", month: "long", year: "numeric",
      }).formatToParts(date).map(({ type, value }) => [type, value]));
      const time = new Intl.DateTimeFormat("es-MX", {
        timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23",
      }).format(date);
      const duration = Number(config.calendarDurationMinutes);
      const end = start + (Number.isFinite(duration) && duration > 0 ? duration : 180) * 60000;
      if (!Number.isFinite(new Date(end).getTime())) return null;
      return {
        start, end, timeZone, time,
        day: parts.day, month: parts.month, year: parts.year,
        dateLabel: `${Number(parts.day)} de ${parts.month} de ${parts.year}`,
        venue: String(config.venueName || "Lugar por confirmar").trim(),
        address: String(config.venueAddress || "").trim(),
      };
    } catch {
      return null; // Una zona horaria inválida nunca crea un evento con una hora equivocada.
    }
  }

  function getMapsUrl(config) {
    const configured = String(config.mapsUrl || "").trim();
    if (configured) {
      try {
        const url = new URL(configured);
        return url.protocol === "https:" ? url.href : null;
      } catch { return null; }
    }
    const address = String(config.venueAddress || "").trim();
    if (!address) return null;
    const url = new URL("https://www.google.com/maps/search/");
    url.search = new URLSearchParams({ api: "1", query: [config.venueName, address].filter(Boolean).join(", ") });
    return url.href;
  }

  function getCalendarUrl(config) {
    const event = getEventDetails(config);
    if (!event) return null;
    // Plantilla oficial de Google Calendar: instantes UTC y zonas IANA explícitas.
    const url = new URL("https://calendar.google.com/calendar/r/eventedit");
    url.search = new URLSearchParams({
      action: "TEMPLATE",
      text: `Birthday soirée · Cumpleaños de ${config.name || "Valentina"}`,
      dates: `${calendarStamp(event.start)}/${calendarStamp(event.end)}`,
      stz: event.timeZone,
      etz: event.timeZone,
      location: [event.venue, event.address].filter(Boolean).join(", "),
      details: `Una noche de música, brindis y buena compañía.\n${event.dateLabel}, ${event.time} h (${event.timeZone}).\nReserva la fecha, yo pongo la celebración.`,
    });
    return url.href;
  }

  root.BirthdayEvent = Object.freeze({ getEventDetails, getMapsUrl, getCalendarUrl });
  if (!root.document) return;

  const config = root.BIRTHDAY_CONFIG || {};
  const section = document.querySelector("#event-details");
  if (!section) return;
  const event = getEventDetails(config);
  const maps = document.querySelector("#event-maps");
  const calendar = document.querySelector("#event-calendar");
  const mapsStatus = document.querySelector("#maps-status");
  const content = document.querySelector("#invitation-content");
  const reducedMotion = root.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelector("#event-venue").textContent = String(config.venueName || "Lugar por confirmar").trim();
  document.querySelector("#event-address").textContent = String(config.venueAddress || "Dirección por confirmar").trim();
  if (event) {
    document.querySelector("#event-day").textContent = event.day;
    document.querySelector("#event-month").textContent = event.month;
    document.querySelector("#event-year").textContent = event.year;
    const date = document.querySelector("#event-date");
    date.dateTime = config.birthdayDate;
    date.setAttribute("aria-label", event.dateLabel);
    const time = document.querySelector("#event-time");
    time.dateTime = config.birthdayDate;
    time.textContent = `${event.time} h`;
    time.setAttribute("aria-label", `${event.time}, zona horaria ${event.timeZone}`);
    calendar.href = getCalendarUrl(config);
    calendar.setAttribute("aria-label", "Guardar en mi calendario (abre Google Calendar en una pestaña nueva)");
  } else {
    document.querySelector("#event-day").textContent = "—";
    document.querySelector("#event-month").textContent = "Fecha por confirmar";
    document.querySelector("#event-year").textContent = "";
    document.querySelector("#event-time").textContent = "Hora por confirmar";
    document.querySelector("#event-date").removeAttribute("datetime");
    document.querySelector("#event-date").setAttribute("aria-label", "Fecha por confirmar");
    document.querySelector("#event-time").removeAttribute("datetime");
    calendar.setAttribute("aria-disabled", "true");
  }

  const mapsUrl = getMapsUrl(config);
  if (mapsUrl) {
    maps.href = mapsUrl;
    maps.removeAttribute("aria-disabled");
    maps.removeAttribute("aria-describedby");
    maps.setAttribute("aria-label", "Cómo llegar (abre Google Maps en una pestaña nueva)");
    mapsStatus.textContent = "";
  }

  // Conserva el diseño del botón sin enviar al invitado a un destino ficticio.
  [maps, calendar].forEach(link => {
    if (!link.hasAttribute("href")) link.tabIndex = -1;
    link.addEventListener("click", (click) => {
      if (link.getAttribute("aria-disabled") === "true") click.preventDefault();
    });
  });

  section.classList.toggle("has-motion", !reducedMotion.matches);
  const observer = "IntersectionObserver" in root ? new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !content.hidden) section.classList.add("is-in-view");
  }, { threshold: 0.12 }) : null;
  if (observer) observer.observe(section);
  else section.classList.add("is-in-view");
  document.querySelector("#back-to-cover").addEventListener("click", () => {
    if (observer) section.classList.remove("is-in-view");
  });
  reducedMotion.addEventListener("change", () => {
    section.classList.toggle("has-motion", !reducedMotion.matches);
  });
})(globalThis);
