/**
 * Production server — copied to dist/index.cjs during build.
 * Serves the SSG-built static files from its own directory (dist/).
 * XML sitemaps are always served as application/xml, never as HTML.
 */
"use strict";

const http = require("http");
const fs   = require("fs");
const path = require("path");

// When running as dist/index.cjs, __dirname IS the dist/ folder.
const STATIC_DIR = __dirname;
const PORT = process.env.PORT || 5000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".xml":  "application/xml; charset=utf-8",
  ".txt":  "text/plain; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".mjs":  "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".pdf":  "application/pdf",
};

function getCacheControl(urlPath, ext) {
  if (urlPath.startsWith("/assets/")) return "public, max-age=31536000, immutable";
  if (ext === ".xml")  return "public, max-age=3600";
  if (ext === ".html") return "no-cache";
  return "public, max-age=86400";
}

const server = http.createServer(function (req, res) {
  const rawPath = req.url.split("?")[0].split("#")[0];
  let filePath  = path.join(STATIC_DIR, rawPath);

  // Resolve directory → index.html
  try {
    const s = fs.statSync(filePath);
    if (s.isDirectory()) filePath = path.join(filePath, "index.html");
  } catch (_) {
    // File doesn't exist
    const ext = path.extname(rawPath);
    if (ext && ext !== ".html") {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }
    // SPA fallback — serve index.html for client-side routes
    filePath = path.join(STATIC_DIR, "index.html");
  }

  fs.readFile(filePath, function (err, content) {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 Internal Server Error");
      return;
    }

    const ext = path.extname(filePath);
    const contentType  = MIME[ext] || "application/octet-stream";
    const cacheControl = getCacheControl(rawPath, ext);

    res.writeHead(200, {
      "Content-Type":           contentType,
      "Cache-Control":          cacheControl,
      "X-Content-Type-Options": "nosniff",
    });
    res.end(content);
  });
});

server.listen(PORT, "0.0.0.0", function () {
  console.log("[server] Listening on http://0.0.0.0:" + PORT);
  console.log("[server] Serving static files from: " + STATIC_DIR);
});
