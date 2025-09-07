E2E tests use Jest with selenium-webdriver.
Run:
1) npm run dev:5173  # in one terminal
2) npm run test:e2e  # in another terminal

Config: e2e/jest.e2e.config.cjs
Tests: *.e2e.js only (TypeScript tests removed to keep setup simple).
Note: Tests expect the dev server on http://localhost:5173. Use E2E_BASE_URL to override.
