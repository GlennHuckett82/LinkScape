# LinkScape

Explore and filter Reddit links with a fast, responsive, and accessible UI.

## Tech stack
- React 17 + Redux Toolkit + React Router
- Vite build tool
- Tailwind CSS for design system
- Framer Motion for animations
- TypeScript
- Jest + Enzyme for unit tests
- Selenium WebDriver (Jest runner) for E2E tests

## Features
- Initial data view on first visit
- Search by terms (debounced)
- Predefined category filters (Hot/New/Top)
- Detailed view (route)
- Cohesive design system and animations
- Error states with recovery
- Responsive, cross-browser support

## Getting started
1. Install dependencies
2. Run the dev server
3. Run unit tests and E2E tests

## Scripts
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview production build
- `npm test` – unit tests
- `npm run test:e2e` – end-to-end tests (dev server must be running on port 5173)

## Wireframes
- See `docs/wireframes` (TBD) – wireframes were used to inform component structure.

## Future work
- Integrate Reddit API with caching and rate-limit backoff
- Modal detail view with comments
- PWA support and offline caching
- CI/CD with deploy previews and Lighthouse CI

## Architecture notes
- React 17 chosen to align with Enzyme adapter compatibility.
- SPA routing configured for static hosting (add 404.html fallback on deploy).