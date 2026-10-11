import test from "node:test";
import assert from "node:assert/strict";
import "../dist/weather.js";

const { summarize, pickTips } = globalThis.BirthdayWeather;

test("el clima de la fiesta cruza la medianoche UTC sin tomar horas fuera del evento", () => {
  const hourly = {
    time: ["2026-11-15T01:00", "2026-11-15T02:00", "2026-11-15T03:00", "2026-11-15T04:00", "2026-11-15T05:00", "2026-11-15T06:00"],
    temperature_2m: [2, 20, 17, 15, 13, 4],
    precipitation_probability: [99, 10, 30, 70, 40, 99],
  };
  assert.deepEqual(
    summarize(hourly, new Date("2026-11-14T20:00:00-06:00"), new Date("2026-11-14T23:00:00-06:00")),
    { min: 13, max: 20, rainChance: 70 },
  );
});

test("si no hay horas de pronóstico, se conserva el clima típico", () => {
  assert.equal(summarize({ time: [], temperature_2m: [], precipitation_probability: [] }, new Date(0), new Date(3600000)), null);
});

test("la recomendación añade paraguas solo con probabilidad de lluvia alta", () => {
  const tips = { cool: "Blazer", rain: "Paraguas", shoes: "Tacón ancho" };
  assert.deepEqual(pickTips({ min: 12, max: 17, rainChance: 39 }, tips).map(tip => tip.text), ["Blazer", "Tacón ancho"]);
  assert.deepEqual(pickTips({ min: 12, max: 17, rainChance: 40 }, tips).map(tip => tip.text), ["Blazer", "Paraguas", "Tacón ancho"]);
});
