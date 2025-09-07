const { Builder, By, until } = require('selenium-webdriver');

describe('LinkScape E2E', () => {
  it('loads homepage title', async () => {
    const { Options: EdgeOptions } = require('selenium-webdriver/edge');
    const edgeOpts = new EdgeOptions().addArguments('--headless=new');
    const driver = await new Builder().forBrowser('MicrosoftEdge').setEdgeOptions(edgeOpts).build();

    const candidates = [global.__E2E_BASE_URL__ || process.env.E2E_BASE_URL, 'http://localhost:5173', 'http://localhost:5174'].filter(Boolean);
    let lastError;
    try {
      for (const base of candidates) {
        try {
          // Debug log
          console.log('E2E navigating to:', base);
          await driver.get(base);
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
