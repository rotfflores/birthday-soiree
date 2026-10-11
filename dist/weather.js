// Script clásico para funcionar tanto en la vista local como al abrir index.html.
// Recomienda qué ponerse según el clima de la noche de la fiesta.
((root) => {
  "use strict";

  const FORECAST_DAYS = 15; // Open-Meteo pronostica hasta 16 días.
  const DEFAULT_TIPS = {
    cold: "Noche fría: un abrigo ligero o una chamarra elegante y medias finas te mantendrán abrigada.",
    cool: "Un chal, blazer o saco ligero sobre tu look de cóctel será perfecto para la terraza.",
    mild: "Telas ligeras y una capa delgada por si refresca más tarde.",
    warm: "Noche cálida: telas frescas y ligeras; puedes dejar el abrigo en casa.",
    rain: "Puede llover: trae un paraguas compacto y calzado que aguante el pasto húmedo.",
    shoes: "Hay jardín: tacones anchos, plataformas o flats elegantes serán tus aliados."
  };
  const MOODS = { cold: "Noche fría", cool: "Noche fresca", mild: "Noche templada", warm: "Noche cálida" };

  function classify(min, max) {
    const average = (Number(min) + Number(max)) / 2;
    if (average < 12) return "cold";
    if (average < 18) return "cool";
    if (average < 24) return "mild";
    return "warm";
  }

  // Resume las horas del pronóstico que caen dentro de la fiesta.
  function summarize(hourly, start, end) {
    const temps = [];
    let rain = 0;
    (hourly.time || []).forEach((time, index) => {
      const moment = Date.parse(`${time}Z`);
      if (moment < start.getTime() || moment > end.getTime()) return;
      const temp = hourly.temperature_2m?.[index];
      if (Number.isFinite(temp)) temps.push(temp);
      const chance = hourly.precipitation_probability?.[index];
      if (Number.isFinite(chance)) rain = Math.max(rain, chance);
    });
    if (!temps.length) return null;
    return { min: Math.round(Math.min(...temps)), max: Math.round(Math.max(...temps)), rainChance: Math.round(rain) };
  }

  function pickTips(weather, tips) {
    const texts = { ...DEFAULT_TIPS, ...(tips || {}) };
    const list = [{ type: "layer", text: texts[classify(weather.min, weather.max)] }];
    if (Number(weather.rainChance) >= 40) list.push({ type: "rain", text: texts.rain });
    list.push({ type: "shoes", text: texts.shoes });
    return list.filter(tip => String(tip.text ?? "").trim());
  }

  root.BirthdayWeather = Object.freeze({ classify, summarize, pickTips });
  if (!root.document) return;

  const config = root.BIRTHDAY_CONFIG || {};
  const section = document.querySelector("#weather");
  if (!section) return;
  const content = document.querySelector("#invitation-content");
  const reducedMotion = root.matchMedia("(prefers-reduced-motion: reduce)");
  const $ = selector => section.querySelector(selector);
  // Iconos "light" de Phosphor Icons (MIT), ver assets/LICENSE-Phosphor.txt.
  const ICONS = {
    layer: '<path d="M240.37,172.8,138,96l25.59-19.2A6,6,0,0,0,166,72a38,38,0,1,0-76,0,6,6,0,0,0,12,0,26,26,0,0,1,51.82-2.88l-29.32,22-.21.16L15.63,172.8A14,14,0,0,0,24,198H232a14,14,0,0,0,8.39-25.2Zm-6.5,11.83A1.85,1.85,0,0,1,232,186H24a2,2,0,0,1-1.19-3.6L128,103.5l105.17,78.9A1.85,1.85,0,0,1,233.87,184.63Z" />',
    rain: '<path d="M238,126.79A110.43,110.43,0,0,0,53.11,55.22a109.51,109.51,0,0,0-35.06,71.57A14,14,0,0,0,32,142h90v58a30,30,0,0,0,60,0,6,6,0,0,0-12,0,18,18,0,0,1-36,0V142h90a14,14,0,0,0,14-15.21ZM94.11,130C95.8,78.79,118.81,49.84,128,40.27c9.2,9.58,32.2,38.53,33.89,89.73Zm-63.57-.65a2,2,0,0,1-.53-1.56,98.14,98.14,0,0,1,82.91-88.62c-12,15-29.43,44.44-30.83,90.83H32A2,2,0,0,1,30.54,129.35Zm194.92,0A2,2,0,0,1,224,130H173.91c-1.4-46.39-18.81-75.87-30.83-90.83A98.14,98.14,0,0,1,226,127.79,2,2,0,0,1,225.46,129.35Z" />',
    shoes: '<path d="M230.53,158.14,179,146.53,68.24,35.76a6,6,0,0,0-8.67.19C37.92,59.62,26,89.47,26,120v72a14,14,0,0,0,14,14H72a14,14,0,0,0,14-14V139.65a115,115,0,0,1,51.74,57.69,13.92,13.92,0,0,0,13,8.66H240a14,14,0,0,0,14-14v-4.73A29.73,29.73,0,0,0,230.53,158.14ZM74,192a2,2,0,0,1-2,2H40a2,2,0,0,1-2-2V126.18A112.75,112.75,0,0,1,74,134Zm168,0a2,2,0,0,1-2,2H150.72a2,2,0,0,1-1.86-1.18,126.53,126.53,0,0,0-45.58-56.65,125.13,125.13,0,0,0-65.12-22C39.47,90.66,48.6,67.83,64.31,48.79L171.76,156.24a6,6,0,0,0,2.92,1.61l53.23,12A17.81,17.81,0,0,1,242,187.31Z" />'
  };


  const fill = (element, value) => {
    const text = String(value ?? "").trim();
    if (element && text) element.textContent = text;
  };
  fill($("#weather-title"), config.weatherTitle);
  fill($("#weather-city"), config.weatherCity);
  fill($("#weather-closing"), config.weatherClosing);

  const render = (weather, source) => {
    $("#weather-temp").textContent = weather.min === weather.max ? `${weather.min}` : `${weather.min}–${weather.max}`;
    $("#weather-mood").textContent = MOODS[classify(weather.min, weather.max)];
    $("#weather-source").textContent = source;
    const rain = Number(weather.rainChance);
    $("#weather-rain").textContent = Number.isFinite(rain) ? `Probabilidad de lluvia: ${rain}%` : "";
    $("#weather-rain").hidden = !Number.isFinite(rain);
    $("#weather-tips").replaceChildren(...pickTips(weather, config.weatherTips).map((tip, index) => {
      const item = document.createElement("li");
      item.className = "weather-tip weather-reveal";
      item.style.setProperty("--weather-delay", `${280 + index * 80}ms`);
      item.innerHTML = `<span class="weather-tip-icon" aria-hidden="true"><svg viewBox="0 0 256 256">${ICONS[tip.type]}</svg></span><span></span>`;
      item.lastChild.textContent = tip.text;
      return item;
    }));
  };

  const typical = { min: 12, max: 17, rainChance: 10, label: "clima típico de esa fecha", ...(config.weatherTypical || {}) };
  render(typical, typical.label);

  // Cuando la fecha está cerca, se cambia al pronóstico real de esa noche.
  const start = new Date(config.birthdayDate);
  const end = new Date(start.getTime() + Number(config.calendarDurationMinutes || 180) * 60000);
  const daysAway = (start.getTime() - Date.now()) / 86400000;
  const latitude = Number(config.weatherLatitude);
  const longitude = Number(config.weatherLongitude);
  if (!Number.isNaN(start.getTime()) && daysAway > -0.2 && daysAway <= FORECAST_DAYS && Number.isFinite(latitude) && Number.isFinite(longitude) && "fetch" in root) {
    const day = date => date.toISOString().slice(0, 10);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability&timezone=UTC&start_date=${day(start)}&end_date=${day(end)}`;
    fetch(url)
      .then(response => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))))
      .then(data => {
        const forecast = summarize(data.hourly || {}, start, end);
        if (forecast) render(forecast, "pronóstico para esa noche");
      })
      .catch(() => { /* Sin conexión: se queda el clima típico. */ });
  }

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
