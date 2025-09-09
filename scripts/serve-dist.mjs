// Minimal static server for the built app (dist) with SPA fallback
import http from 'http';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');

// Simple CLI args: --port 5181 --host 127.0.0.1
const argv = process.argv.slice(2);
const getArg = (name) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : undefined;
};
const cliPort = getArg('--port');
const cliHost = getArg('--host');

const host = cliHost || '127.0.0.1';
const port = cliPort ? Number(cliPort) : (process.env.PORT ? Number(process.env.PORT) : 5181);

// Minimal content-type map for common assets produced by Vite
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

// Send a file with appropriate headers; 404 if missing
const send = async (res, filePath, code = 200) => {
  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(code, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
};

// Basic static file server with SPA fallback to index.html for client routes
const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
    let filePath = path.normalize(path.join(distDir, decodeURIComponent(reqUrl.pathname)));

    // Prevent path traversal outside dist
    if (!filePath.startsWith(distDir)) {
      return send(res, path.join(distDir, 'index.html'));
    }

    let st;
    try { st = await stat(filePath); } catch { st = null; }

    if (st && st.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!st) {
      // SPA fallback to index.html for client-side routes
      return send(res, path.join(distDir, 'index.html'));
    }

    return send(res, filePath);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Server error');
  }
});

server.listen(port, host, () => {
  console.log(`Static server running at http://${host}:${port}/`);
});
