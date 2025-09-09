# LinkScape

Explore Reddit with a fast, responsive, in‑app reader. Built with React + Redux and deployable to GitHub Pages.

## Tech stack
- React 17 + Redux Toolkit + React Router 6
- Vite 5 (TS) + Tailwind CSS
- Jest + Enzyme (unit), Selenium WebDriver (E2E)
- GitHub Actions (CI) + GitHub Pages (CD)

## Features
- Home feed with search and Hot/New/Top filters
- In‑app post reader with selftext formatting and top comments
- Inline error + retry, subtle animations, scroll restoration
- SPA routing with 404 fallback for static hosts

## Quick start
```bash
npm install
npm run dev:5173   # http://localhost:5173
```

## Tests
- Unit: `npm run test:fast`
- E2E (needs a server): `npm run test:e2e`

## Production build
- Standard build: `npm run build`
- Local static preview: `npm run build && npm run serve:build` → http://127.0.0.1:5181
- GitHub Pages build: `npm run build:pages` (base=/LinkScape/)
- Open directly from File Explorer: `npm run build:file` then open `dist/index.html`
	- Note: file:// opening works best for the initial page; client‑side routes (e.g. /post/...) require a web server. Use `serve:build` for SPA routing.

## Deploy (GitHub Pages)
- CI builds with the correct base and deploys `dist`.
- Site URL: `https://<username>.github.io/LinkScape/`.

## Notes on performance (Windows + OneDrive)
- OneDrive syncing can slow test/build I/O. For the snappiest experience, clone to a non‑synced folder like `C:\dev\LinkScape`.
- Jest cache is stored in the system temp to avoid OneDrive overhead.

## Project structure
- `src/` components, pages, Redux slices, and utils (with inline comments)
- `scripts/serve-dist.mjs` static server with SPA fallback
- `e2e/` Selenium tests and setup
- `.github/workflows/` CI + deploy workflows

## Troubleshooting
- If E2E can’t find a server, it will auto‑start on 5192. Set `E2E_BASE_URL` to override.
- For GitHub Pages, the base path is controlled via `VITE_BASE_PATH` env (defaults to `/`).