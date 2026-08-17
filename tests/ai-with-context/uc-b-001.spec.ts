import { expect, test, type Page } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

/**
 * E2E test for UC-B-001: Filtrování TOS dokumentů
 * @see .github/docs/use-cases/ai-with-context/uc-b-001.md
 *
 * Requires global auth via storageState (tests/manual/setup.ts).
 * Assumes dev DB contains TOS rows matching the hard-coded search term.
 */

const TOS_URL = "http://localhost:3000/admin/tos";
const SEARCH_TERM = "TOS-";
const NO_MATCH_TERM = "zzz-no-tos-match-xyz";

const searchInput = (page: Page) => page.getByPlaceholder("Hledat dokumenty");

function clearSearchButton(page: Page) {
   return searchInput(page).locator("..").getByRole("button").first();
}

async function submitSearch(page: Page, term: string) {
   const trimmed = term.trim();

   await searchInput(page).fill(term);
   await searchInput(page).press("Enter");

   await page.waitForURL((url) => {
      if (!url.pathname.endsWith("/admin/tos")) {
         return false;
      }

      const search = url.searchParams.get("search");
      return trimmed ? search === trimmed : search === null;
   });
}

async function assertAllVisibleRowsMatch(page: Page, term: string) {
   const rows = page.locator("table tbody tr");
   const count = await rows.count();
   expect(count).toBeGreaterThan(0);

   for (let i = 0; i < count; i++) {
      const text = await rows.nth(i).innerText();
      expect(text.toLowerCase()).toContain(term.toLowerCase());
   }
}

function expectSearchParams(page: Page, expected: { search?: string | null; page?: string }) {
   const url = new URL(page.url());

   if (expected.search === null) {
      expect(url.searchParams.has("search")).toBe(false);
   } else if (expected.search !== undefined) {
      expect(url.searchParams.get("search")).toBe(expected.search);
   }

   if (expected.page !== undefined) {
      expect(url.searchParams.get("page")).toBe(expected.page);
   }
}

test.describe("UC-B-001: Filtrování TOS dokumentů", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto(TOS_URL);
      await expect(page.getByRole("heading", { name: "TOS Dokumenty" })).toBeVisible();
   });

   test("Scénář úspěšného průchodu: vyhledání a filtrování seznamu", async ({ page }) => {
      await submitSearch(page, SEARCH_TERM);

      expectSearchParams(page, { search: SEARCH_TERM, page: "1" });
      await expect(searchInput(page)).toHaveValue(SEARCH_TERM);
      await assertAllVisibleRowsMatch(page, SEARCH_TERM);
   });

   test("Spouštěč: otevření stránky s query parametrem search", async ({ page }) => {
      await page.goto(`${TOS_URL}?search=${encodeURIComponent(SEARCH_TERM)}`);

      expectSearchParams(page, { search: SEARCH_TERM });
      await expect(searchInput(page)).toHaveValue(SEARCH_TERM);
      await assertAllVisibleRowsMatch(page, SEARCH_TERM);
   });

   test("Obchodní pravidlo: case-insensitive shoda (tos-)", async ({ page }) => {
      await submitSearch(page, "tos-");

      expectSearchParams(page, { search: "tos-", page: "1" });
      await assertAllVisibleRowsMatch(page, SEARCH_TERM);
   });

   test("Reset stránkování: nové hledání z page=2 nastaví page=1", async ({ page }) => {
      await page.goto(`${TOS_URL}?items=1&page=2`);
      expectSearchParams(page, { page: "2" });

      await submitSearch(page, SEARCH_TERM);

      expectSearchParams(page, { search: SEARCH_TERM, page: "1" });
      await assertAllVisibleRowsMatch(page, SEARCH_TERM);
   });

   test("AP-1: prázdný výraz zruší filtr a nastaví page=1", async ({ page }) => {
      await submitSearch(page, SEARCH_TERM);
      expectSearchParams(page, { search: SEARCH_TERM, page: "1" });

      await submitSearch(page, "");

      expectSearchParams(page, { search: null, page: "1" });
      await expect(searchInput(page)).toHaveValue("");
      await expect(page.locator("table tbody tr").first()).toBeVisible();
   });

   test("AP-1: výraz z bílých znaků zruší filtr a nastaví page=1", async ({ page }) => {
      await submitSearch(page, SEARCH_TERM);
      expectSearchParams(page, { search: SEARCH_TERM, page: "1" });

      await submitSearch(page, "   ");

      expectSearchParams(page, { search: null, page: "1" });
      await expect(searchInput(page)).toHaveValue("");
      await expect(page.locator("table tbody tr").first()).toBeVisible();
   });

   test("AP-2: žádné odpovídající dokumenty", async ({ page }) => {
      await submitSearch(page, NO_MATCH_TERM);

      expectSearchParams(page, { search: NO_MATCH_TERM, page: "1" });
      await expect(searchInput(page)).toHaveValue(NO_MATCH_TERM);
      await expect(page.locator("table tbody tr")).toHaveCount(0);
      await expect(page.getByText("0 / 0")).toBeVisible();
   });

   test("AP-3: zrušení filtru tlačítkem X", async ({ page }) => {
      await submitSearch(page, SEARCH_TERM);
      expectSearchParams(page, { search: SEARCH_TERM, page: "1" });
      await assertAllVisibleRowsMatch(page, SEARCH_TERM);

      await clearSearchButton(page).click();
      await page.waitForURL((url) => url.pathname.endsWith("/admin/tos") && !url.searchParams.has("search"));

      expectSearchParams(page, { search: null, page: "1" });
      await expect(searchInput(page)).toHaveValue("");
      await expect(page.locator("table tbody tr").first()).toBeVisible();
   });

   test("AP-3: zrušení filtru z page=2 resetuje stránkování na page=1", async ({ page }) => {
      await submitSearch(page, SEARCH_TERM);
      await page.goto(`${TOS_URL}?search=${encodeURIComponent(SEARCH_TERM)}&items=1&page=2`);
      expectSearchParams(page, { search: SEARCH_TERM, page: "2" });

      await clearSearchButton(page).click();
      await page.waitForURL((url) => url.pathname.endsWith("/admin/tos") && !url.searchParams.has("search"));

      expectSearchParams(page, { search: null, page: "1" });
      await expect(searchInput(page)).toHaveValue("");
      await expect(page.locator("table tbody tr").first()).toBeVisible();
   });
});
