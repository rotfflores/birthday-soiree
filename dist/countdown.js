// Script clásico: funciona al abrir index.html con doble clic y también desde Node.
(root => {
  "use strict";
  // Calcula cada actualización desde la fecha absoluta para evitar acumulación de desfase.
  function getCountdown(targetTime, now = Date.now()) {
    if (!Number.isFinite(targetTime) || !Number.isFinite(now)) return null;
    const totalSeconds = Math.max(0, Math.ceil((targetTime - now) / 1000));
    return {
      complete: totalSeconds === 0,
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  }
  root.BirthdayCountdown = Object.freeze({ getCountdown });
})(globalThis);
