// Script clásico para funcionar tanto en la vista local como al abrir index.html.
// Montón de Polaroids: la foto superior se arrastra a los lados y pasa al fondo del montón.
(() => {
  "use strict";

  const config = window.BIRTHDAY_CONFIG || {};
  const section = document.querySelector("#gallery");
  if (!section) return;
  const content = document.querySelector("#invitation-content");
  const stack = document.querySelector("#gallery-stack");
  const status = document.querySelector("#gallery-status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const fill = (element, value) => {
    const text = String(value ?? "").trim();
    if (element && text) element.textContent = text;
  };
  fill(document.querySelector("#gallery-title"), config.galleryTitle);
  fill(document.querySelector("#gallery-text"), config.galleryText);

  // Si config.js trae fotos, reemplazan a las de ejemplo del HTML.
  const photos = Array.isArray(config.galleryPhotos) ? config.galleryPhotos.filter(photo => photo && photo.src) : [];
  if (photos.length) {
    stack.replaceChildren(...photos.map(photo => {
      const figure = document.createElement("figure");
      figure.className = "polaroid";
      const frame = document.createElement("div");
      frame.className = "polaroid-photo";
      const image = document.createElement("img");
      image.src = photo.src;
      image.alt = String(photo.alt ?? photo.caption ?? "");
      image.width = 720;
      image.height = 720;
      image.draggable = false;
      image.decoding = "async";
      frame.append(image);
      figure.append(frame);
      if (String(photo.caption ?? "").trim()) {
        const caption = document.createElement("figcaption");
        caption.textContent = String(photo.caption).trim();
        figure.append(caption);
      }
      return figure;
    }));
  }

  const cards = Array.from(stack.querySelectorAll(".polaroid"));
  if (!cards.length) return;
  // Giros pequeños y distintos, como fotos colocadas a mano.
  const ROTATIONS = [-3, 2.5, -1.5, 4, -4.5, 1.8, -2.4, 3.2];
  const SHIFTS = [[0, 0], [9, 5], [-10, 8], [7, -4], [-8, 3], [11, 9], [-5, -6], [6, 10]];
  cards.forEach((card, index) => {
    card.style.setProperty("--rest-rot", `${ROTATIONS[index % ROTATIONS.length]}deg`);
    card.addEventListener("dragstart", event => event.preventDefault());
  });
  let order = cards.map((_, index) => index);
  let busy = false;

  const layout = () => {
    order.forEach((cardIndex, position) => {
      const card = cards[cardIndex];
      card.style.zIndex = String(cards.length - position);
      // La de arriba queda centrada; las de abajo asoman con un pequeño desplazamiento.
      const shift = position === 0 ? [0, 0] : SHIFTS[(cardIndex + position) % SHIFTS.length];
      card.style.setProperty("--rest-x", `${shift[0]}px`);
      card.style.setProperty("--rest-y", `${shift[1]}px`);
      card.classList.toggle("is-top", position === 0);
      card.setAttribute("aria-hidden", position === 0 ? "false" : "true");
    });
  };

  const setDrag = (card, x, rotation) => {
    card.style.setProperty("--drag-x", `${x}px`);
    card.style.setProperty("--drag-rot", `${rotation}deg`);
  };

  // Lanza la foto superior hacia un lado y la pasa al fondo del montón.
  const advance = (direction) => {
    if (busy || cards.length < 2) return;
    const card = cards[order[0]];
    order = order.slice(1).concat(order[0]);
    const announce = () => { status.textContent = `Foto ${order[0] + 1} de ${cards.length}`; };
    if (reducedMotion.matches) {
      setDrag(card, 0, 0);
      card.classList.remove("is-dragging");
      layout();
      announce();
      return;
    }
    busy = true;
    const distance = stack.offsetWidth * 1.25;
    card.classList.remove("is-dragging");
    card.classList.add("is-leaving");
    card.style.zIndex = String(cards.length + 1);
    setDrag(card, direction * distance, direction * 16);
    window.setTimeout(() => {
      // Ya fuera, se coloca detrás y vuelve a su lugar debajo de las demás.
      card.classList.remove("is-leaving");
      card.classList.add("is-returning");
      layout();
      card.style.zIndex = "0";
      setDrag(card, 0, 0);
      announce();
      window.setTimeout(() => { card.classList.remove("is-returning"); busy = false; }, 460);
    }, 340);
  };

  // Arrastre con dedo o mouse. touch-action: pan-y deja al navegador el gesto vertical.
  let drag = null;
  stack.addEventListener("pointerdown", (event) => {
    if (busy || (event.pointerType === "mouse" && event.button !== 0)) return;
    const card = event.target.closest(".polaroid");
    if (!card || !card.classList.contains("is-top")) return;
    drag = { card, id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, time: event.timeStamp, horizontal: false };
  });
  stack.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.horizontal) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      // Gesto principalmente vertical: se suelta para que la página siga bajando.
      if (Math.abs(dy) >= Math.abs(dx)) { drag = null; return; }
      drag.horizontal = true;
      stack.setPointerCapture(event.pointerId);
      drag.card.classList.add("is-dragging");
    }
    event.preventDefault();
    drag.velocity = (dx - drag.dx) / Math.max(1, event.timeStamp - drag.time);
    drag.dx = dx;
    drag.time = event.timeStamp;
    setDrag(drag.card, dx, reducedMotion.matches ? 0 : dx * 0.06);
  });
  const release = (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const { card, dx, horizontal, velocity = 0 } = drag;
    drag = null;
    if (!horizontal) return;
    const threshold = Math.min(110, stack.offsetWidth * 0.3);
    // Pasa si supera la distancia o si fue un gesto rápido en la misma dirección.
    const flick = Math.abs(velocity) > 0.6 && Math.abs(dx) > 40 && Math.sign(velocity) === Math.sign(dx);
    if (event.type !== "pointercancel" && (Math.abs(dx) > threshold || flick)) {
      advance(Math.sign(dx));
    } else {
      // Distancia corta: vuelve suavemente a su lugar.
      card.classList.remove("is-dragging");
      setDrag(card, 0, 0);
    }
  };
  stack.addEventListener("pointerup", release);
  stack.addEventListener("pointercancel", release);

  stack.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      advance(event.key === "ArrowLeft" ? -1 : 1);
    }
  });

  layout();

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
