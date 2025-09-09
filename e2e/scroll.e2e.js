const { Builder, By, until } = require('selenium-webdriver');

describe('Scroll restoration', () => {
  it('restores scroll when navigating back from a post', async () => {
    const { Options: EdgeOptions } = require('selenium-webdriver/edge');
    const edgeOpts = new EdgeOptions().addArguments('--headless=new');
    const driver = await new Builder().forBrowser('MicrosoftEdge').setEdgeOptions(edgeOpts).build();

    const base = global.__E2E_BASE_URL__ || process.env.E2E_BASE_URL || 'http://127.0.0.1:5192';
    try {
      await driver.get(base);
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
