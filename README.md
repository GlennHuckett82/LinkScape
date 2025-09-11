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

## Developer Notes

### Routing and base paths (GitHub Pages)
- We use BrowserRouter in normal http/https contexts with `basename` set from Vite’s `import.meta.env.BASE_URL`.
- GitHub Pages serves the app at `/LinkScape/`, so the build for Pages sets the base to `/LinkScape/` (see `npm run build:pages`).
- When opening the app from `file://` (e.g., double‑clicking `index.html`), we fall back to HashRouter to keep routes functional without a server (see `src/main.tsx`).

### E2E seeding and Chrome path
- Tests can append `?seed=1` to the URL to add a deterministic local post on load (see `App.tsx`). This ensures the E2E suite always has something stable to click.
- In CI, we run Selenium with headless Chrome. If Chrome isn’t on the PATH, set `CHROME_PATH` to the Chrome binary so the driver can launch it.
- The E2E tests probe a few candidate base URLs and then navigate with `?seed=1` (see `e2e/*.js`).

### hasInteracted/resetHome model (UX)
- `hasInteracted` (in `src/store/uiSlice.ts`) starts as `false` so the home page shows only the Search and Hot/New/Top controls over the background.
- It flips to `true` after the user searches or picks a category, which allows content to load.
- `resetHome()` resets the home view to the clean initial state (clears the search, resets category to Hot, and sets `hasInteracted` to false). The "Back to homepage" buttons use this to hide content again and bring back the background‑only look.
- This model keeps the first impression clean and intentional, while still making it easy to return to that state at any time.

Tip: If you need to re‑run a search with the exact same term (e.g., to refresh), `triggerSearch()` increments a small nonce in the UI slice that HomePage listens to.

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