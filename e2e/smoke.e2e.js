const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('LinkScape E2E', () => {
  it('loads homepage title', async () => {
    const chromeOpts = new chrome.Options().addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage');
    if (process.env.CHROME_PATH) {
      chromeOpts.setChromeBinaryPath(process.env.CHROME_PATH);
    }
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOpts).build();

  const candidates = [
      global.__E2E_BASE_URL__ || process.env.E2E_BASE_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5192',
      'http://127.0.0.1:5181',
      'http://localhost:5181'
    ].filter(Boolean);
    let lastError;
    try {
      for (const base of candidates) {
        try {
          // Debug log
          const url = base.includes('?') ? `${base}&seed=1` : `${base}?seed=1`;
          console.log('E2E navigating to:', url);
          await driver.get(url);
          await driver.wait(until.elementLocated(By.css('header')), 45000);
          const text = await driver.findElement(By.css('header')).getText();
          expect(text).toMatch(/LinkScape/i);
          return; // success
        } catch (err) {
          lastError = err;
        }
      }
      if (lastError) throw lastError;
    } finally {
      await driver.quit();
    }
  });
});
