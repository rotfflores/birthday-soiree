import { writeFile } from "node:fs/promises";
const assets = [
  ["cormorant-italic.ttf", "https://fonts.gstatic.com/s/cormorantgaramond/v21/co3smX5slCNuHLi8bLeY9MK7whWMhyjYrGFEsdtdc62E6zd58jDOjw.ttf"],
  ["cormorant-regular.ttf", "https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_v86GnM.ttf"],
  ["dm-sans.ttf", "https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxhTg.ttf"],
  ["OFL-Cormorant.txt", "https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/OFL.txt"],
  ["OFL-DM-Sans.txt", "https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt"],
];
await Promise.all(assets.map(async ([file, url]) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
  await writeFile(`dist/assets/${file}`, Buffer.from(await response.arrayBuffer()));
  console.log(`Guardado: ${file}`);
}));
