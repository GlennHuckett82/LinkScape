const { spawn } = require('child_process');
const http = require('http');
const readline = require('readline');

async function waitFor(url, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) return resolve(false);
        setTimeout(check, 400);
      });
    };
    check();
  });
}

module.exports = async () => {
  // If an explicit base URL is provided, prefer it
  const envUrl = process.env.E2E_BASE_URL;
  if (envUrl) {
    if (await waitFor(envUrl, 5000)) {
      global.__E2E_BASE_URL__ = envUrl;
      return;
    }
    // fall through to autodetect if envUrl isn't reachable
  }
  // Reuse existing server if running; otherwise fail fast and ask caller to start it
  if (await waitFor('http://localhost:5173', 3000)) {
    global.__E2E_BASE_URL__ = 'http://localhost:5173';
    return;
  }
  if (await waitFor('http://localhost:5174', 3000)) {
    global.__E2E_BASE_URL__ = 'http://localhost:5174';
    return;
  }
  // Common static-serve ports
  if (await waitFor('http://127.0.0.1:5192', 3000)) {
    global.__E2E_BASE_URL__ = 'http://127.0.0.1:5192';
    return;
  }
  if (await waitFor('http://127.0.0.1:5181', 3000)) {
    global.__E2E_BASE_URL__ = 'http://127.0.0.1:5181';
    return;
  }
  if (await waitFor('http://localhost:5181', 3000)) {
    global.__E2E_BASE_URL__ = 'http://localhost:5181';
    return;
  }
  // As a fallback, try to start the static server ourselves on 5192
  const serverCmd = process.platform === 'win32' ? 'node' : 'node';
  const args = ['scripts/serve-dist.mjs', '--port', '5192'];
  const proc = spawn(serverCmd, args, { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] });
  global.__VITE_SERVER_PID__ = proc.pid;

  // Wait for server to be reachable
  const ok = await waitFor('http://127.0.0.1:5192', 10000);
  if (ok) {
    global.__E2E_BASE_URL__ = 'http://127.0.0.1:5192';
    return;
  }
  try { proc.kill(); } catch {}
  throw new Error('Dev/static server not running and auto-start failed. Start it first: npm run dev:5173 or npm run build && node scripts/serve-dist.mjs');
};
