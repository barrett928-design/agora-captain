import { test, expect } from '@playwright/test';

// Helper: click a tab by its label (tabs are divs, not buttons)
async function clickTab(page, name) {
  await page.locator('.tab', { hasText: name }).click();
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
test('header shows correct boat name', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('BENETEAU FIRST 47.7', { exact: false })).toBeVisible();
});

// ─── TABS ─────────────────────────────────────────────────────────────────────
test('all five tabs are present', async ({ page }) => {
  await page.goto('/');
  for (const tab of ['Projects', 'Voyage Log', 'Maintenance', 'Fuel Log', 'Spare Parts']) {
    await expect(page.locator('.tab', { hasText: tab })).toBeVisible();
  }
});

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
test('Projects tab loads with entries and add button', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: '+ Add Task' })).toBeVisible();
  await expect(page.getByText('Develop and drill fire plan')).toBeVisible();
});

test('Projects form opens and closes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+ Add Task' }).click();
  await expect(page.locator('.modal-title', { hasText: 'Add Task' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.locator('.modal-title', { hasText: 'Add Task' })).not.toBeVisible();
});

// ─── VOYAGE LOG ───────────────────────────────────────────────────────────────
test('Voyage Log tab shows entries and add button', async ({ page }) => {
  await page.goto('/');
  await clickTab(page, 'Voyage Log');
  await expect(page.getByRole('button', { name: '+ Log Voyage' })).toBeVisible();
  await expect(page.getByText('Jan 4, 2025')).toBeVisible();
});

test('Voyage Log form has Destination field', async ({ page }) => {
  await page.goto('/');
  await clickTab(page, 'Voyage Log');
  await page.getByRole('button', { name: '+ Log Voyage' }).click();
  await expect(page.getByPlaceholder('e.g. Redfish Island, Offats Bayou')).toBeVisible();
});

// ─── MAINTENANCE ──────────────────────────────────────────────────────────────
test('Maintenance tab loads with entries and schedule button', async ({ page }) => {
  await page.goto('/');
  await clickTab(page, 'Maintenance');
  await expect(page.getByRole('button', { name: 'Schedule' })).toBeVisible();
  await expect(page.getByText('Oil change and coolant')).toBeVisible();
});

test('Schedule modal opens and shows last done entries', async ({ page }) => {
  await page.goto('/');
  await clickTab(page, 'Maintenance');
  await page.getByRole('button', { name: 'Schedule' }).click();
  await expect(page.locator('.modal-title', { hasText: 'Maintenance Schedule' })).toBeVisible();
  // Verify last done data is rendering for at least one entry
  await expect(page.locator('.schedule-notes', { hasText: 'Last done:' }).first()).toBeVisible();
});

// ─── SPARE PARTS ──────────────────────────────────────────────────────────────
test('Spare Parts tab loads with entries and add button', async ({ page }) => {
  await page.goto('/');
  await clickTab(page, 'Spare Parts');
  await expect(page.getByRole('button', { name: '+ Add Part' })).toBeVisible();
  await expect(page.getByText('Fuel Filters')).toBeVisible();
});

// ─── CHECKLISTS (sub-tab of Voyage Log) ──────────────────────────────────────
test('Checklists sub-tab loads with departure checklist', async ({ page }) => {
  await page.goto('/');
  await clickTab(page, 'Voyage Log');
  await page.locator('.sub-tab', { hasText: 'Checklists' }).click();
  await expect(page.locator('.checklist-title', { hasText: 'Departure' })).toBeVisible();
  await expect(page.getByText('Check weather forecast')).toBeVisible();
});

// ─── FUEL LOG ─────────────────────────────────────────────────────────────────
test('Fuel Log tab loads with add button', async ({ page }) => {
  await page.goto('/');
  await clickTab(page, 'Fuel Log');
  await expect(page.getByRole('button', { name: '+ Log Fill-Up' })).toBeVisible();
  await expect(page.getByText('No fuel entries yet.')).toBeVisible();
});

test('Fuel Log form has diesel and gas sections', async ({ page }) => {
  await page.goto('/');
  await clickTab(page, 'Fuel Log');
  await page.getByRole('button', { name: '+ Log Fill-Up' }).click();
  await expect(page.getByText('DIESEL')).toBeVisible();
  await expect(page.getByText('GAS (DINGHY)')).toBeVisible();
  await expect(page.getByPlaceholder('e.g. Galveston Yacht Basin')).toBeVisible();
});
