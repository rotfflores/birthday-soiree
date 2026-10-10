import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

const root = resolve("dist");
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".webp": "image/webp", ".svg": "image/svg+xml", ".ttf": "font/ttf", ".mp3": "audio/mpeg", ".wav": "audio/wav" };
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    const filename = resolve(root, `.${decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname)}`);
    if (!filename.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    const data = await readFile(filename);
    response.writeHead(200, { "Content-Type": types[extname(filename)] || "application/octet-stream", "Cache-Control": "no-cache" });
    response.end(data);
  } catch { response.writeHead(404, { "Content-Type": "text/plain" }).end("No encontrado"); }
});
server.listen(port, "127.0.0.1", () => console.log(`Local: http://127.0.0.1:${port}`));
