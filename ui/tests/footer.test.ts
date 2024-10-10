import { expect, test } from '@playwright/test';

test('Check all footer links are working', async ({ page }) => {
  await page.goto('/apps');

  const footer = await page.waitForSelector('#footer', { state: 'visible' });

  // Get all links on the page
  const links = await footer.$$eval('a', (allLinks) =>
    allLinks.map((link) => ({
      href: link.href,
      text: link.innerText.trim()
    }))
  );

  // Iterate over each link and check if the URL returns a 200 status code
  for (const link of links) {
    if (link.href.startsWith('mailto')) continue; //skip email links
    const response = await page.request.get(link.href);
    expect(response.status(), `Link "${link.text}" (${link.href}) is broken`).toBe(200);
  }
});
