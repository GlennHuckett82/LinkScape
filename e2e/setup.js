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
  // Reuse existing server if running; otherwise fail fast and ask caller to start it
  if (await waitFor('http://localhost:5173', 3000)) {
    global.__E2E_BASE_URL__ = 'http://localhost:5173';
    return;
  }
  if (await waitFor('http://localhost:5174', 3000)) {
    global.__E2E_BASE_URL__ = 'http://localhost:5174';
    return;
  }
  throw new Error('Dev server not running. Start it first: npm run dev:5173');
};
