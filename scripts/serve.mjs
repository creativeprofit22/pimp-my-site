// Dev-only static server for the repo root. No dependencies.
// Usage: node scripts/serve.mjs [port]   then open http://localhost:8080/site/
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.argv[2] ?? process.env.PORT ?? 8080);
// Only these top-level folders are served.
const allowed = new Set(["site", "variants"]);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
    if (path === "/") {
      res.writeHead(302, { location: "/site/" });
      res.end();
      return;
    }
    if (path.endsWith("/")) path += "index.html";
    const file = normalize(join(root, path));
    const top = file.slice(root.length + 1).split(sep)[0];
    if (!file.startsWith(root + sep) || !top || !allowed.has(top)) {
      res.writeHead(404).end("Not found");
      return;
    }
    const info = await stat(file);
    if (!info.isFile()) {
      res.writeHead(404).end("Not found");
      return;
    }
    res.writeHead(200, {
      "content-type": types[extname(file)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    createReadStream(file).pipe(res);
  } catch {
    res.writeHead(404).end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving ${root} at http://localhost:${port}/site/`);
});
