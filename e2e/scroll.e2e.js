const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('Scroll restoration', () => {
  it('restores scroll when navigating back from a post', async () => {
    const chromeOpts = new chrome.Options().addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage');
    if (process.env.CHROME_PATH) {
      chromeOpts.setChromeBinaryPath(process.env.CHROME_PATH);
    }
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOpts).build();

    const base = global.__E2E_BASE_URL__ || process.env.E2E_BASE_URL || 'http://127.0.0.1:5192';
    try {
      const url = base.includes('?') ? `${base}&seed=1` : `${base}?seed=1`;
      await driver.get(url);
      await driver.wait(until.elementLocated(By.css('main .grid')), 30000);

      // Scroll down to simulate browsing
      await driver.executeScript('window.scrollTo(0, 800)');
      const yBefore = await driver.executeScript('return window.scrollY');

      // Click the first post card
      const first = await driver.findElement(By.css('a[href^="/post/"]'));
      await first.click();
      await driver.wait(until.elementLocated(By.css('article')), 30000);

      // Go back
      await driver.navigate().back();
      await driver.wait(until.elementLocated(By.css('main .grid')), 30000);

      const yAfter = await driver.executeScript('return window.scrollY');
      expect(Math.abs(yAfter - yBefore)).toBeLessThan(5);
    } finally {
      await driver.quit();
    }
  });
});
