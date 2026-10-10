(() => {
  "use strict";

  const config = window.BIRTHDAY_CONFIG || {};
  const name = String(config.name || "Valentina").trim();
  const age = String(config.age ?? 28);
  const cover = document.querySelector("#cover");
  const content = document.querySelector("#invitation-content");
  const openButton = document.querySelector("#open-invitation");
  const backButton = document.querySelector("#back-to-cover");
  const soundButton = document.querySelector("#sound-toggle");
  const audioStatus = document.querySelector("#audio-status");
  const audio = document.querySelector("#birthday-music");
  const photo = document.querySelector("#birthday-photo");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let opening = false;
  let userOpened = false;
  let transitionTimer;

  document.querySelectorAll("[data-name]").forEach(element => { element.textContent = name; });
  document.querySelectorAll("[data-age]").forEach(element => { element.textContent = `Mis ${age}`; });
  document.title = `${name} · Birthday soirée`;
  document.querySelector('meta[name="description"]').content = `Una noche para brindar, reír y celebrar. Estás invitado al cumpleaños de ${name}.`;
  if (config.photo) photo.src = config.photo;
  photo.alt = config.photoAlt || `Retrato de ${name}`;
  // Ajusta nombres largos al ancho disponible, incluso después de cargar las fuentes.
  const fitName = () => {
    document.querySelectorAll("[data-name]").forEach(heading => {
      if (!heading.getClientRects().length) return;
      heading.style.setProperty("--name-scale", "1");
      const range = document.createRange();
      range.selectNodeContents(heading);
      const textWidth = range.getBoundingClientRect().width;
      const available = heading.clientWidth - 12;
      if (textWidth > available && available > 0) {
        heading.style.setProperty("--name-scale", String(available / textWidth));
      }
    });
  };
  requestAnimationFrame(fitName);
  document.fonts.ready.then(fitName);
  window.addEventListener("resize", fitName);

  if (config.music) audio.src = config.music;
  const requestedVolume = Number(config.musicVolume ?? 0.35);
  audio.volume = Number.isFinite(requestedVolume) ? Math.min(1, Math.max(0, requestedVolume)) : 0.35;

  const updateSound = () => {
    const playing = !audio.paused;
    soundButton.classList.toggle("is-muted", !playing);
    soundButton.setAttribute("aria-pressed", String(playing));
    soundButton.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
  };
  const playMusic = () => {
    if (!userOpened || !config.music) return;
    // play() se ejecuta directamente durante el toque, antes de esperar la transición.
    const playRequest = audio.play();
    if (playRequest) playRequest.catch(() => {
      audioStatus.textContent = "La música no pudo iniciarse. Puedes intentar reproducirla con el botón de música.";
      updateSound();
    });
  };
  audio.addEventListener("play", updateSound);
  audio.addEventListener("pause", updateSound);
  audio.addEventListener("error", () => {
    audioStatus.textContent = "La música no está disponible. La invitación sigue abierta.";
    updateSound();
  });

  const finishOpening = () => {
    if (!opening) return;
    clearTimeout(transitionTimer);
    cover.hidden = true;
    content.classList.add("is-open");
    fitName();
    soundButton.hidden = !config.music;
    opening = false;
    content.focus({ preventScroll: true });
    window.dispatchEvent(new CustomEvent("invitation:opened", { detail: { name, age } }));
  };
  cover.addEventListener("transitionend", event => {
    if (event.target === cover && event.propertyName === "opacity") finishOpening();
  });
  openButton.addEventListener("click", () => {
    if (opening || cover.hidden) return;
    opening = true;
    userOpened = true;
    openButton.disabled = true;
    playMusic();
    content.hidden = false;
    content.inert = false;
    fitName();
    cover.inert = true;
    content.getBoundingClientRect();
    content.classList.add("is-visible");
    cover.classList.add("is-leaving");
    transitionTimer = setTimeout(finishOpening, reducedMotion.matches ? 0 : 950);
  });
  backButton.addEventListener("click", () => {
    clearTimeout(transitionTimer);
    opening = false;
    audio.pause();
    soundButton.hidden = true;
    content.hidden = true;
    content.inert = true;
    content.classList.remove("is-open", "is-visible");
    cover.hidden = false;
    cover.inert = false;
    cover.classList.remove("is-leaving");
    openButton.disabled = false;
    fitName();
    openButton.focus({ preventScroll: true });
  });
  soundButton.addEventListener("click", () => {
    audioStatus.textContent = "";
    if (audio.paused) playMusic();
    else audio.pause();
  });
  updateSound();
})();
