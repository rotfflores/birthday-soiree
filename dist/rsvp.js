// Script clásico para funcionar tanto en la vista local como al abrir index.html.
((root) => {
  "use strict";

  const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  // "2026-11-01" → "1 de noviembre". Se interpreta como fecha de calendario, sin zona horaria.
  function formatDeadline(value) {
    const text = String(value ?? "").trim();
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (!match) return text;
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31) return text;
    return `${day} de ${MONTHS[month - 1]}`;
  }

  root.BirthdayRsvp = Object.freeze({ formatDeadline });
  if (!root.document) return;

  const config = root.BIRTHDAY_CONFIG || {};
  const section = document.querySelector("#rsvp");
  if (!section) return;
  const hostName = String(config.name || "Valentina").trim();
  const form = document.querySelector("#rsvp-form");
  const nameInput = document.querySelector("#rsvp-name");
  const nameError = document.querySelector("#rsvp-name-error");
  const content = document.querySelector("#invitation-content");
  const acceptButton = document.querySelector("#rsvp-accept");
  const thanks = document.querySelector("#rsvp-thanks");
  const reducedMotion = root.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll("[data-rsvp-name]").forEach(element => { element.textContent = hostName; });
  document.querySelectorAll("[data-rsvp-age]").forEach(element => { element.textContent = String(config.age ?? 28); });
  const deadline = formatDeadline(config.rsvpDeadline);
  if (deadline) document.querySelector("#rsvp-deadline").textContent = deadline;
  else document.querySelector(".rsvp-deadline").hidden = true;

  const setNameError = (message) => {
    nameError.textContent = message;
    nameInput.setAttribute("aria-invalid", message ? "true" : "false");
    nameInput.closest(".rsvp-field").classList.toggle("has-error", Boolean(message));
  };
  nameInput.addEventListener("input", () => { if (nameInput.value.trim()) setNameError(""); });

  // "Aceptar invitación" despliega el formulario.
  acceptButton.addEventListener("click", () => {
    acceptButton.setAttribute("aria-expanded", "true");
    acceptButton.closest(".rsvp-accept").hidden = true;
    form.hidden = false;
    section.classList.add("is-accepted");
    nameInput.focus({ preventScroll: true });
    form.scrollIntoView({ block: "nearest", behavior: reducedMotion.matches ? "auto" : "smooth" });
  });

  // Solo en pantalla: la respuesta no se envía ni se guarda.
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const guestName = nameInput.value.trim();
    if (!guestName) {
      setNameError("Escribe tu nombre para confirmar.");
      nameInput.focus();
      return;
    }
    setNameError("");
    document.querySelector("#rsvp-guest").textContent = guestName;
    form.hidden = true;
    thanks.hidden = false;
    section.classList.add("is-confirmed");
    thanks.focus({ preventScroll: true });
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
