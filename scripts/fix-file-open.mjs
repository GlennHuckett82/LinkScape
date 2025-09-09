// Removes crossorigin attributes from dist/index.html to improve file:// compatibility in Edge/Chrome.
// Run after vite build when targeting file explorer opening.
import fs from 'fs';
import path from 'path';

const distHtml = path.resolve(process.cwd(), 'dist', 'index.html');

try {
  let html = fs.readFileSync(distHtml, 'utf8');
  // Strip crossorigin attributes from script and link tags.
  html = html.replace(/\s+crossorigin(=("[^"]*"|'[^']*'|[^\s>]+))?/gi, '');
  fs.writeFileSync(distHtml, html);
  console.log('[fix-file-open] Stripped crossorigin from dist/index.html');
} catch (err) {
  console.error('[fix-file-open] Failed to patch dist/index.html:', err.message);
  process.exitCode = 1;
}
