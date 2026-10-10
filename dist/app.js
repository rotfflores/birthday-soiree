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

  const veil = document.querySelector("#veil");
  const ambient = document.querySelector("#ambient");
  const frame = document.querySelector("#portrait-frame");
  const timers = [];
  const later = (fn, ms) => { timers.push(setTimeout(fn, ms)); };
  const clearTimers = () => { timers.forEach(clearTimeout); timers.length = 0; };

  // Partículas suaves que flotan detrás de la invitación.
  if (!reducedMotion.matches && ambient) {
    const count = window.innerWidth < 760 ? 14 : 24;
    for (let i = 0; i < count; i += 1) {
      const mote = document.createElement("span");
      const kind = Math.random();
      mote.className = `mote${kind < 0.28 ? " is-star" : kind > 0.85 ? " is-cherry" : ""}`;
      const size = kind < 0.28 ? 5 + Math.random() * 7 : 4 + Math.random() * 12;
      mote.style.cssText = `--x:${(Math.random() * 100).toFixed(1)}%;--s:${size.toFixed(1)}px;--d:${(16 + Math.random() * 18).toFixed(1)}s;--delay:${(-Math.random() * 30).toFixed(1)}s;--sway:${(Math.random() * 120 - 60).toFixed(0)}px;--o:${(0.35 + Math.random() * 0.5).toFixed(2)}`;
      ambient.append(mote);
    }
  }

  // Inclinación sutil del retrato al mover el cursor.
  if (frame && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion.matches) {
    cover.addEventListener("pointermove", event => {
      const box = frame.getBoundingClientRect();
      const x = (event.clientX - (box.left + box.width / 2)) / window.innerWidth;
      const y = (event.clientY - (box.top + box.height / 2)) / window.innerHeight;
      frame.style.setProperty("--rx", `${(x * 9).toFixed(2)}deg`);
      frame.style.setProperty("--ry", `${(-y * 7).toFixed(2)}deg`);
    });
    cover.addEventListener("pointerleave", () => {
      frame.style.setProperty("--rx", "0deg");
      frame.style.setProperty("--ry", "0deg");
    });
  }

  // Destellos que salen disparados desde un punto.
  const burst = (x, y, amount = 22, spread = 1) => {
    if (reducedMotion.matches) return;
    const colors = ["#D8A7B1", "#FFF8F0", "#F3DCDD", "#C98A9B"];
    for (let i = 0; i < amount; i += 1) {
      const piece = document.createElement("span");
      const angle = (Math.PI * 2 * i) / amount + Math.random() * 0.4;
      const distance = (70 + Math.random() * 150) * spread;
      piece.className = `burst${Math.random() > 0.55 ? " is-dot" : ""}`;
      piece.style.cssText = `--x:${x}px;--y:${y}px;--s:${(6 + Math.random() * 10).toFixed(1)}px;--c:${colors[i % colors.length]};--dx:${(Math.cos(angle) * distance).toFixed(0)}px;--dy:${(Math.sin(angle) * distance).toFixed(0)}px;--r:${(Math.random() * 360 - 180).toFixed(0)}deg;animation-delay:${(Math.random() * 120).toFixed(0)}ms`;
      piece.addEventListener("animationend", () => piece.remove(), { once: true });
      document.body.append(piece);
    }
  };

  const showContent = () => {
    cover.hidden = true;
    content.hidden = false;
    content.inert = false;
    content.classList.add("is-visible", "is-open");
    fitName();
    soundButton.hidden = !config.music;
    content.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    window.dispatchEvent(new CustomEvent("invitation:opened", { detail: { name, age } }));
  };
  const finishOpening = () => {
    if (!opening) return;
    opening = false;
    showContent();
    if (reducedMotion.matches) return;
    veil.classList.add("is-revealing");
    veil.classList.remove("is-covering");
    later(() => burst(window.innerWidth / 2, window.innerHeight / 2, 28, window.innerWidth < 760 ? 0.9 : 1.4), 650);
    later(() => veil.classList.remove("is-revealing"), 1100);
  };
  openButton.addEventListener("click", () => {
    if (opening || cover.hidden) return;
    opening = true;
    userOpened = true;
    openButton.disabled = true;
    playMusic();
    cover.inert = true;
    if (reducedMotion.matches) { finishOpening(); return; }
    const box = openButton.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    veil.style.setProperty("--x", `${x}px`);
    veil.style.setProperty("--y", `${y}px`);
    burst(x, y, 16, 0.6);
    veil.getBoundingClientRect();
    veil.classList.add("is-covering");
    later(finishOpening, 1050);
  });
  backButton.addEventListener("click", () => {
    clearTimers();
    opening = false;
    audio.pause();
    soundButton.hidden = true;
    veil.classList.remove("is-covering", "is-revealing");
    content.hidden = true;
    content.inert = true;
    content.classList.remove("is-open", "is-visible");
    cover.hidden = false;
    cover.inert = false;
    cover.classList.remove("is-leaving");
    openButton.disabled = false;
    window.scrollTo(0, 0);
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
