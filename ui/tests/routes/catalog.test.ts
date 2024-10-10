// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2024-Present The UDS Authors

import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Category } from '../../src/lib/types/gen';
import { sortApplicationsAlphabetically } from '../../src/lib/utils';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogData = sortApplicationsAlphabetically(
  JSON.parse(fs.readFileSync(path.join(__dirname, '../../static/api/apps/index.json'), 'utf-8'))
);

test.describe('Catalog View', () => {
  test('displays catalog items', async ({ page }) => {
    await page.goto('/apps');

    // Wait for the app cards to be visible
    await page.waitForSelector('.app-card', { state: 'visible' });

    // Get all app cards
    const appCards = await page.$$('.app-card');

    // Ensure there is at least one app card
    expect(appCards.length).toBeGreaterThan(0);

    // Check all available apps, up to the first 3
    const appsToCheck = Math.min(appCards.length, 3);
    for (let i = 0; i < appsToCheck; i++) {
      const app = catalogData[i];
      const appCard = appCards[i];

      console.log(`Checking app: ${app.metadata.name}`);

      // Check for app name
      const appNameElement = await appCard.$('.app-card-header-title');
      expect(appNameElement).not.toBeNull();
      const appNameText = (await appNameElement?.textContent()) ?? '';
      expect(appNameText).toBe(app.spec.title || app.metadata.name);

      // Check for app description
      if (app.spec.description) {
        const descriptionElement = await appCard.$('.app-card-description');
        expect(descriptionElement).not.toBeNull();
        const actualDescriptionText = await descriptionElement?.textContent();
        expect(actualDescriptionText).not.toBeNull();
        if (actualDescriptionText) {
          expect(actualDescriptionText.length).toBeLessThanOrEqual(150);
        }
      }

      // Check for "Learn More" button
      const learnMoreButton = await appCard.$('text="Learn More"');
      expect(learnMoreButton).not.toBeNull();
    }
  });

  test('displays correct icons for apps', async ({ page }) => {
    await page.goto('/apps');

    // Wait for the app cards to be visible
    await page.waitForSelector('.app-card', { state: 'visible' });

    // Get all app cards
    const appCards = await page.$$('.app-card');

    // Ensure there is at least one app card
    expect(appCards.length).toBeGreaterThan(0);

    // Check all available apps, up to the first 3
    const appsToCheck = Math.min(appCards.length, 3);
    for (let i = 0; i < appsToCheck; i++) {
      const app = catalogData[i];
      const appCard = appCards[i];

      const appIcon = await appCard.$('.app-card-header-icon');
      expect(appIcon).not.toBeNull();

      if (app.spec.icons && app.spec.icons.length > 0) {
        const iconSrc = await appIcon?.getAttribute('src');
        expect(iconSrc).toBe(app.spec.icons[0].src);
      } else {
        const iconSrc = await appIcon?.getAttribute('src');
        expect(iconSrc).toContain('/doug.svg');
      }
    }
  });
});

test.describe('Sidebar', () => {
  test('displays all filter categories', async ({ page }) => {
    await page.goto('/apps');
    const filterCategories = ['Category', 'Supported Infrastructure', 'Security'];
    for (const category of filterCategories) {
      const categoryButton = await page.waitForSelector(`button:has-text("${category}")`);
      expect(categoryButton).not.toBeNull();
    }
  });
  test('toggles filter category visibility', async ({ page }) => {
    await page.goto('/apps');

    // Wait for the sidebar to be visible
    await page.waitForSelector('#filter-sidebar');

    // Check if the Category filter exists
    const categoryFilter = page.locator('button:has-text("Category")');
    await expect(categoryFilter).toBeVisible();

    // Check if the filter values container exists
    const filterValuesContainer = page.locator('#filter-values-Category');
    await expect(filterValuesContainer).toBeVisible();

    // Click the category button to collapse the filter
    await categoryFilter.click();

    // Check if the filter values are hidden after clicking
    await expect(filterValuesContainer).toBeHidden();

    // Click the category button again to expand the filter
    await categoryFilter.click();

    // Check if the filter values are visible again
    await expect(filterValuesContainer).toBeVisible();
  });

  test('applies and removes filters', async ({ page }) => {
    await page.goto('/apps');
    // Wait for the app cards to be visible
    await page.waitForSelector('.app-card', { state: 'visible' });
    const unfilteredResults = await page.$$('.app-card');
    const unfilteredResultsLength = unfilteredResults.length;
    console.log(`Unfiltered results: ${unfilteredResultsLength}`);
    // Apply a filter
    await page.click(`label:has-text("${Category.Web}")`);

    // Check if the filter is applied (you may need to adjust this based on how filtered results are displayed)
    const filteredResults = await page.$$('.app-card');
    const filteredResultsLength = filteredResults.length;
    console.log(`Filtered results: ${filteredResultsLength}`);
    expect(filteredResultsLength).toBeLessThan(unfilteredResultsLength);

    // Remove the filter
    await page.click(`label:has-text("${Category.Web}")`);

    // Check if all results are shown again
    const allResults = await page.$$('.app-card');
    const allResultsLength = allResults.length;
    console.log(`All results: ${allResultsLength}`);
    expect(allResultsLength).toBe(unfilteredResultsLength);
  });

  test('removes all filters', async ({ page }) => {
    await page.goto('/apps');
    // Wait for the app cards to be visible
    await page.waitForSelector('.app-card', { state: 'visible' });
    const unfilteredResults = await page.$$('.app-card');
    const unfilteredResultsLength = unfilteredResults.length;
    console.log(`Unfiltered results: ${unfilteredResultsLength}`);
    // Apply a filter
    await page.click(`label:has-text("${Category.Arcade}")`);
    await page.click(`label:has-text("${Category.Web}")`);

    // Check if the filter is applied (you may need to adjust this based on how filtered results are displayed)
    const filteredResults = await page.$$('.app-card');
    const filteredResultsLength = filteredResults.length;
    console.log(`Filtered results: ${filteredResultsLength}`);
    expect(filteredResultsLength).toBeLessThan(unfilteredResultsLength);

    // Remove the filters
    await page.getByText('Clear all').click();

    // Check if all results are shown again
    const allResults = await page.$$('.app-card');
    const allResultsLength = allResults.length;
    console.log(`All results: ${allResultsLength}`);
    expect(allResultsLength).toBe(unfilteredResultsLength);
  });
});

test.describe('Search Functionality', () => {
  test('displays search input in navbar', async ({ page }) => {
    await page.goto('/apps');
    const searchInput = await page.waitForSelector('#application-search');
    expect(searchInput).not.toBeNull();
  });

  test('filters apps based on search query', async ({ page }) => {
    await page.goto('/apps');
    await page.waitForSelector('.app-card', { state: 'visible' });

    const initialAppCards = await page.$$('.app-card');
    const initialCount = initialAppCards.length;

    // Use the first app's name as the search query
    const searchQuery = catalogData[0].spec.title;
    await page.fill('#application-search', searchQuery);

    // Wait for the debounce
    await page.waitForTimeout(600);

    const filteredAppCards = await page.$$('.app-card');
    expect(filteredAppCards.length).toBeLessThan(initialCount);

    // Check if the filtered results contain the search query
    for (const card of filteredAppCards) {
      const titleElement = await card.$('.app-card-header-title');
      const title = await titleElement?.textContent();
      expect(title?.toLowerCase()).toContain(searchQuery.toLowerCase());
    }
  });

  test('clears search results when query is emptied', async ({ page }) => {
    await page.goto('/apps');
    await page.waitForSelector('.app-card', { state: 'visible' });

    const initialAppCards = await page.$$('.app-card');
    const initialCount = initialAppCards.length;

    // Search for something
    await page.fill('#application-search', 'test');
    await page.waitForTimeout(600);

    // Clear the search
    await page.fill('#application-search', '');
    await page.waitForTimeout(600);

    const finalAppCards = await page.$$('.app-card');
    expect(finalAppCards.length).toBe(initialCount);
  });

  test('keyboard shortcut focuses search input', async ({ page }) => {
    await page.goto('/apps');
    await page.waitForSelector('#application-search');

    // Use keyboard.down and keyboard.up instead of keyboard.press
    await page.keyboard.down('Control');
    await page.keyboard.press('k');
    await page.keyboard.up('Control');

    // Wait for a short time to allow for focus to change
    await page.waitForTimeout(100);

    const focusedElement = await page.evaluate(() => document.activeElement?.id);

    expect(focusedElement).toBe('application-search');
  });
});
