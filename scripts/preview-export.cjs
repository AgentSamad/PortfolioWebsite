// Preview the exported Pages build at its real deployment prefix.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../out");
const prefix = process.env.PAGES_BASE_PATH || "/PortfolioWebsite";
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "application/javascript", ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".mp4": "video/mp4" };
http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname); }
  catch { response.writeHead(400).end(); return; }
  if (pathname === "/") { response.writeHead(302, { Location: prefix + "/" }).end(); return; }
  if (pathname !== prefix && !pathname.startsWith(prefix + "/")) { response.writeHead(404).end(); return; }
  const relative = pathname.slice(prefix.length).replace(/^\/+/, "");
  const target = path.resolve(root, relative);
  if (target !== root && !target.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
  const candidates = [target, target + ".html", path.join(target, "index.html")];
  const file = candidates.find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!file) { response.writeHead(404).end("Not found"); return; }
  response.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(response);
}).listen(3001, "127.0.0.1", () => console.log("Export preview: http://localhost:3001" + prefix + "/"));
