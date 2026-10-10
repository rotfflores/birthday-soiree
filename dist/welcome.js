import { getCountdown } from "./countdown.js";

const config = window.BIRTHDAY_CONFIG || {};
const content = document.querySelector("#invitation-content");
const welcome = document.querySelector("#welcome");
const countdown = document.querySelector("#countdown");
const completeMessage = document.querySelector("#countdown-complete");
const backButton = document.querySelector("#back-to-cover");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const targetTime = Date.parse(config.birthdayDate);
const units = Object.fromEntries(["days", "hours", "minutes", "seconds"].map(unit => [unit, document.querySelector(`[data-countdown="${unit}"]`)]));
let interval;
let entranceTimer;
let entranceReady = false;
let inViewport = false;

countdown.setAttribute("aria-label", `Cuenta regresiva para el cumpleaños de ${config.name || "Valentina"}`);

const stopCountdown = () => { clearInterval(interval); interval = undefined; };
const renderCountdown = () => {
  const remaining = getCountdown(targetTime);
  if (!remaining || remaining.complete) {
    countdown.hidden = true;
    completeMessage.hidden = false;
    const message = remaining ? "¡Hoy celebramos!" : "La cuenta comienza muy pronto.";
    if (completeMessage.textContent !== message) completeMessage.textContent = message;
    stopCountdown();
    return false;
  }
  countdown.hidden = false;
  completeMessage.hidden = true;
  for (const [unit, element] of Object.entries(units)) {
    const value = String(remaining[unit]).padStart(2, "0");
    if (element.textContent !== value) element.textContent = value;
    element.classList.toggle("is-long-number", value.length > 3);
  }
  return true;
};
const startCountdown = () => {
  stopCountdown();
  if (renderCountdown() && !document.hidden) interval = setInterval(renderCountdown, 1000);
};

const revealWelcome = () => {
  if (entranceReady && inViewport) welcome.classList.add("is-in-view");
};
welcome.classList.toggle("has-motion", !reducedMotion.matches);
const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
  inViewport = entries[0].isIntersecting;
  revealWelcome();
}, { threshold: 0.12 }) : null;
if (observer) observer.observe(welcome);
else inViewport = true;

window.addEventListener("invitation:opened", () => {
  startCountdown();
  clearTimeout(entranceTimer);
  // Acompaña el desvanecimiento del velo existente, sin ocultar la sección al reducir movimiento.
  if (reducedMotion.matches) {
    entranceReady = true;
    welcome.classList.add("is-in-view");
  } else {
    entranceTimer = setTimeout(() => { entranceReady = true; revealWelcome(); }, 650);
  }
});
backButton.addEventListener("click", () => {
  stopCountdown();
  clearTimeout(entranceTimer);
  entranceReady = false;
  welcome.classList.remove("is-in-view");
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden || content.hidden) stopCountdown();
  else startCountdown();
});
reducedMotion.addEventListener("change", () => {
  welcome.classList.toggle("has-motion", !reducedMotion.matches);
  if (reducedMotion.matches && !content.hidden) welcome.classList.add("is-in-view");
});
renderCountdown();
