import test from "node:test";
import assert from "node:assert/strict";
import "../dist/event-details.js";

const { getEventDetails, getMapsUrl, getCalendarUrl } = globalThis.BirthdayEvent;
const example = {
  name: "Valentina",
  birthdayDate: "2026-11-14T20:00:00-06:00",
  eventTimeZone: "America/Mexico_City",
  venueName: "Salón & Jardín",
  venueAddress: "Calle de prueba 28, Ciudad de México",
  calendarDurationMinutes: 180,
};

test("la fecha impresa conserva el día y la hora de México aunque UTC ya sea el día siguiente", () => {
  const event = getEventDetails(example);
  assert.equal(event.day, "14");
  assert.equal(event.month, "noviembre");
  assert.equal(event.year, "2026");
  assert.equal(event.time, "20:00");
  assert.equal(event.start, Date.parse(example.birthdayDate));
});

test("el calendario comparte el instante del contador, la zona y el lugar completo", () => {
  const params = new URL(getCalendarUrl(example)).searchParams;
  assert.equal(params.get("dates"), "20261115T020000Z/20261115T050000Z");
  assert.equal(params.get("stz"), example.eventTimeZone);
  assert.equal(params.get("etz"), example.eventTimeZone);
  assert.equal(params.get("location"), `${example.venueName}, ${example.venueAddress}`);
  assert.ok(params.get("text").includes("Valentina"));
});

test("una fecha y zona personalizadas conservan el instante durante el cambio de horario", () => {
  const config = { ...example, birthdayDate: "2026-11-01T01:30:00-04:00", eventTimeZone: "America/New_York", calendarDurationMinutes: 120 };
  assert.equal(getEventDetails(config).time, "01:30");
  assert.equal(new URL(getCalendarUrl(config)).searchParams.get("dates"), "20261101T053000Z/20261101T073000Z");
});

test("Maps abre el enlace configurado o busca la dirección completa sin alterar caracteres", () => {
  const url = "https://maps.app.goo.gl/ejemplo";
  assert.equal(getMapsUrl({ ...example, mapsUrl: url }), url);
  const params = new URL(getMapsUrl(example)).searchParams;
  assert.equal(params.get("query"), `${example.venueName}, ${example.venueAddress}`);
  assert.equal(params.get("api"), "1");
  assert.equal(getMapsUrl({ mapsUrl: "", venueAddress: "" }), null);
  assert.equal(getMapsUrl({ mapsUrl: "javascript:alert(1)" }), null);
});

test("los datos especiales se codifican sin introducir parámetros nuevos en el calendario", () => {
  const config = { ...example, name: "Ana & Sofía", venueAddress: "Piso 2 #28; entrada A & B\nColonia Centro" };
  const params = new URL(getCalendarUrl(config)).searchParams;
  assert.equal(params.get("text"), "Birthday soirée · Cumpleaños de Ana & Sofía");
  assert.equal(params.get("location"), `${config.venueName}, ${config.venueAddress}`);
  assert.equal(params.size, 7);
});

test("una fecha ambigua o zona inválida no ofrece guardar una hora incorrecta", () => {
  for (const config of [
    { ...example, birthdayDate: "2026-11-14T20:00:00" },
    { ...example, birthdayDate: "fecha inválida" },
    { ...example, eventTimeZone: "Zona/Inexistente" },
  ]) {
    assert.equal(getEventDetails(config), null);
    assert.equal(getCalendarUrl(config), null);
  }
});
