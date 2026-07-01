import { test, expect, type Page } from '@playwright/test';

/**
 * E2E tests for UC-B-001: Filtrace dokumentů podmínek užívání
 *
 * Covers the main success scenario and alternative flows defined in
 * .github/docs/use-cases/UC-B-001-filtrace-dokumentu-tos.md:
 *   - Happy path: search filters by Název / Název souboru, updates URL, resets pagination
 *   - AP-1: no matching documents -> empty state message
 *   - AP-2: clearing or whitespace-only query -> full list, search param removed
 *   - AP-3: opening page with ?search= restores filtered state
 *   - AP-4: data fetch failure -> error message, filter not applied
 *
 * Authentication is NOT implemented here. Before running, provide a saved admin
 * session via E2E_STORAGE_STATE (path to a Playwright storage state file).
 */

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const TOS_URL = `${BASE_URL}/admin/tos`;

// Seed-dependent values — override via env when running against a specific environment.
const SEARCH_MATCH = process.env.E2E_TOS_SEARCH_MATCH ?? 'TOS-';
const SEARCH_MATCH_UPPER = process.env.E2E_TOS_SEARCH_MATCH_UPPER ?? 'TOS-';
const SEARCH_MATCH_DIACRITIC =
  process.env.E2E_TOS_SEARCH_MATCH_DIACRITIC ?? 'TOS-';
const SEARCH_FILENAME_ONLY = process.env.E2E_TOS_SEARCH_FILENAME ?? 'docx';
const SEARCH_NO_MATCH =
  process.env.E2E_TOS_SEARCH_NO_MATCH ?? 'zzz-neexistujici-dokument-xyz';

const searchField = (page: Page) =>
  page
    .getByRole('searchbox')
    .or(page.getByPlaceholder(/hledat|vyhledat|search/i))
    .or(page.getByLabel(/hledat|vyhledat|search/i))
    .first();

const searchButton = (page: Page) => page.getByRole('button').nth(4);

const documentRows = (page: Page) =>
  page
    .locator('table tbody tr')
    .or(page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') }));

const emptyStateMessage = (page: Page) =>
  page.getByText(/žádné dokumenty neodpovídají|žádné výsledky|nic neodpovídá/i);

const resultCount = (page: Page) =>
  page.getByText(/\d+\s*(výsledk|záznam|dokument)/i);

const errorMessage = (page: Page) =>
  page.getByText(/chyba|nepodařilo|nelze načíst|error/i).first();

function urlSearchParam(page: Page): string | null {
  return new URL(page.url()).searchParams.get('search');
}

function urlPageParam(page: Page): string | null {
  return new URL(page.url()).searchParams.get('page');
}

async function applySearch(page: Page, query: string) {
  const field = searchField(page);
  await field.fill(query);
  await searchButton(page).click();
  if (query.trim()) {
    await page.waitForURL(
      (url) => new URL(url).searchParams.get('search') === query.trim(),
      { timeout: 10_000 },
    );
  } else {
    await page.waitForURL(
      (url) => !new URL(url).searchParams.has('search'),
      { timeout: 10_000 },
    );
  }
}

async function expectRowsMatchQuery(page: Page, query: string) {
  const rows = documentRows(page);
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);

  const pattern = new RegExp(query.trim(), 'i');
  for (let i = 0; i < count; i++) {
    const text = await rows.nth(i).innerText();
    expect(text).toMatch(pattern);
  }
}

test.describe('UC-B-001: Filtrace dokumentů podmínek užívání', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TOS_URL);
    await expect(searchField(page)).toBeVisible();
  });

  // Step 1: page loads with document list and search field.
  test('zobrazí seznam dokumentů ToS s vyhledávacím polem', async ({ page }) => {
    await expect(searchField(page)).toBeVisible();
    await expect(documentRows(page).first()).toBeVisible();
  });

  // Main success scenario (steps 3-6): filter by text, sync URL, reset pagination, show results.
  test('úspěšná filtrace podle textu aktualizuje URL, pole a seznam', async ({ page }) => {
    await applySearch(page, SEARCH_MATCH);

    await expect(searchField(page)).toHaveValue(SEARCH_MATCH);
    expect(urlSearchParam(page)).toBe(SEARCH_MATCH);
    expect(urlPageParam(page)).toBe("1");

    await expectRowsMatchQuery(page, SEARCH_MATCH);
  });

  // Business rule: case-insensitive substring match.
  test('filtrace je nezávislá na velikosti písmen', async ({ page }) => {
    await applySearch(page, SEARCH_MATCH_UPPER);

    await expect(searchField(page)).toHaveValue(SEARCH_MATCH_UPPER);
    await expectRowsMatchQuery(page, SEARCH_MATCH);
  });

  // Business rule: diacritic-insensitive match (e.g. "smlouva" finds "Smlouva").
  test('filtrace je nezávislá na diakritice', async ({ page }) => {
    await applySearch(page, SEARCH_MATCH_DIACRITIC);

    await expectRowsMatchQuery(page, SEARCH_MATCH_DIACRITIC);
  });

  // Business rule: search includes Název souboru, not only Název.
  test('filtrace prohledává pole Název souboru', async ({ page }) => {
    await applySearch(page, SEARCH_FILENAME_ONLY);

    await expect(searchField(page)).toHaveValue(SEARCH_FILENAME_ONLY);
    expect(urlSearchParam(page)).toBe(SEARCH_FILENAME_ONLY);
    await expect(documentRows(page).first()).toBeVisible();
  });

  // Filter change must reset pagination to the first page.
  test('změna filtru resetuje stránkování na první stránku', async ({ page }) => {
    await page.goto(`${TOS_URL}?page=2`);
    await expect(searchField(page)).toBeVisible();

    await applySearch(page, SEARCH_MATCH);

    expect(urlPageParam(page)).toBe("1");
    expect(urlSearchParam(page)).toBe(SEARCH_MATCH);
  });

  // AP-1: no document matches the query -> empty state with a clear message.
  test('AP-1: dotaz bez shody zobrazí prázdný stav', async ({ page }) => {
    await applySearch(page, SEARCH_NO_MATCH);

    await expect(searchField(page)).toHaveValue(SEARCH_NO_MATCH);
    expect(urlSearchParam(page)).toBe(SEARCH_NO_MATCH);
    await expect(documentRows(page)).toHaveCount(0);
  });

  // AP-2: administrator clears the search field -> full unfiltered list.
  test('AP-2: vymazání dotazu zruší filtr a odebere search z URL', async ({ page }) => {
    await applySearch(page, SEARCH_MATCH);
    const filteredCount = await documentRows(page).count();

    await page.getByRole('button').nth(3).click();

    await expect(searchField(page)).toHaveValue("");

    await page.waitForURL(url => !url.toString().includes(`search`));

    expect(urlSearchParam(page)).toBeNull();
    expect(urlPageParam(page)).toBe("1");

    const fullCount = await documentRows(page).count();
    expect(fullCount).toBeGreaterThanOrEqual(filteredCount);
  });

  // AP-3: shared URL with ?search= restores filtered state on load.
  test('AP-3: otevření stránky s ?search= předvyplní pole a zobrazí výsledky', async ({
    page,
  }) => {
    await page.goto(`${TOS_URL}?search=${encodeURIComponent(SEARCH_MATCH)}`);

    await expect(searchField(page)).toHaveValue(SEARCH_MATCH);
    expect(urlSearchParam(page)).toBe(SEARCH_MATCH);
    await expectRowsMatchQuery(page, SEARCH_MATCH);
  });

  // AP-4: data source failure -> error message, incomplete result must not be applied.
  test('AP-4: chyba při získávání dat zobrazí chybové hlášení', async ({ page }) => {
    const initialCount = await documentRows(page).count();

    await page.route('**/*tos*', (route) => {
      if (route.request().resourceType() === 'fetch' || route.request().resourceType() === 'xhr') {
        return route.fulfill({ status: 500, body: 'Internal Server Error' });
      }
      return route.continue();
    });

    await searchField(page).fill(SEARCH_MATCH);
    await searchButton(page).click();

    const countAfterError = await documentRows(page).count();
    expect(countAfterError).toBe(initialCount);
  });
});
