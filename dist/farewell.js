// Script clásico para funcionar tanto en la vista local como al abrir index.html.
(() => {
  "use strict";

  const config = window.BIRTHDAY_CONFIG || {};
  const section = document.querySelector("#farewell");
  if (!section) return;
  const content = document.querySelector("#invitation-content");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Los textos personalizables conservan el contenido del HTML si se dejan vacíos.
  const fill = (element, value) => {
    const text = String(value ?? "").trim();
    if (element && text) element.textContent = text;
  };
  fill(document.querySelector("#farewell-title"), config.farewellTitle);
  fill(document.querySelector("#farewell-text"), config.farewellText);
  fill(document.querySelector("#farewell-highlight"), config.farewellHighlight);
  fill(document.querySelector("#farewell-sign-off"), config.farewellSignOff);
  document.querySelectorAll("[data-farewell-name]").forEach(element => fill(element, config.name));

  section.classList.toggle("has-motion", !reducedMotion.matches);
  const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
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
})();
