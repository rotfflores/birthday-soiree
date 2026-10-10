import test from "node:test";
import assert from "node:assert/strict";
import { getCountdown } from "../dist/countdown.js";

test("descompone días, horas, minutos y segundos sin perder unidades", () => {
  const now = Date.parse("2026-10-10T12:00:00-06:00");
  const target = now + (2 * 86400 + 7 * 3600 + 18 * 60 + 42) * 1000;
  assert.deepEqual(getCountdown(target, now), {complete:false,days:2,hours:7,minutes:18,seconds:42});
});
test("no termina antes de la fecha y llega exactamente a cero", () => {
  const target = 5000;
  assert.equal(getCountdown(target,4999).complete,false);
  assert.equal(getCountdown(target,4999).seconds,1);
  assert.deepEqual(getCountdown(target,5000),{complete:true,days:0,hours:0,minutes:0,seconds:0});
  assert.deepEqual(getCountdown(target,8000),{complete:true,days:0,hours:0,minutes:0,seconds:0});
});
test("la fecha de México representa el mismo instante en cualquier zona", () => {
  const target = Date.parse("2026-11-14T20:00:00-06:00");
  assert.equal(target,Date.parse("2026-11-15T02:00:00Z"));
  assert.equal(getCountdown(target,Date.parse("2026-11-15T01:00:00Z")).hours,1);
});
test("una actualización tardía usa el tiempo real, sin acumular desfase", () => {
  const target = 60000;
  assert.equal(getCountdown(target,0).minutes,1);
  assert.equal(getCountdown(target,47000).seconds,13);
});
test("una fecha inválida no produce valores NaN en el contador", () => {
  assert.equal(getCountdown(Date.parse("fecha inválida")),null);
});
