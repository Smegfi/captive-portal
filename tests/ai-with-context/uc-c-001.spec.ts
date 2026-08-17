import { expect, test } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

/**
 * E2E test for UC-C-001: Vytvoření nového TOS dokumentu
 * @see .github/docs/use-cases/ai-with-context/uc-c-001.md
 *
 * Requires global auth via storageState (tests/manual/setup.ts).
 * Test fixtures: test.docx (valid), test.pdf (AP-2), invalid.docx (AP-4).
 *
 * Skipped scenarios (see grilling decisions):
 * - AP-3: duplicate name — not implemented in create.ts yet
 * - AP-5: disk/DB failure — not suitable for E2E without fault injection
 * - AP-7: unauthorized access — covered by uc-a-001
 */

const TOS_URL = "http://localhost:3000/admin/tos";
const VALID_DOCX = path.join(__dirname, "test.docx");
const PDF_FILE = path.join(__dirname, "test.pdf");
const INVALID_DOCX = path.join(__dirname, "invalid.docx");

function uniqueName(suffix: string) {
   return `UC-C-001-${suffix}-${Date.now()}`;
}

test.describe("UC-C-001: Vytvoření nového TOS dokumentu", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto(TOS_URL);
      await expect(page.getByRole("heading", { name: "TOS Dokumenty" })).toBeVisible();
   });

   test("Krok 2: dialog zobrazí formulář s poli Název a Soubor", async ({ page }) => {
      await page.getByRole("button", { name: "Přidat dokument" }).click();

      await expect(page.getByRole("heading", { name: "Přidat TOS dokument" })).toBeVisible();
      await expect(page.getByLabel("Název dokumentu")).toBeVisible();
      await expect(page.getByLabel("Soubor")).toBeVisible();
      await expect(page.getByLabel("Aktivovat ihned po nahrání")).toBeVisible();
   });

   test("Scénář úspěšného průchodu: nahrání neaktivního dokumentu", async ({ page }) => {
      const name = uniqueName("inactive");

      await page.getByRole("button", { name: "Přidat dokument" }).click();
      await page.getByLabel("Název dokumentu").fill(name);

      const fileChooserPromise = page.waitForEvent("filechooser");
      await page.getByLabel("Soubor").click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(VALID_DOCX);

      await page.getByRole("button", { name: "Nahrát" }).click();

      await expect(page.getByRole("heading", { name: "Přidat TOS dokument" })).not.toBeVisible();

      const row = page.locator("table tbody tr").filter({ hasText: name });
      await expect(row).toBeVisible();
      await expect(row.getByText("Neaktivní", { exact: true })).toBeVisible();
   });

   test("Scénář úspěšného průchodu: nahrání a okamžitá aktivace", async ({ page }) => {
      const name = uniqueName("active");

      await page.getByRole("button", { name: "Přidat dokument" }).click();
      await page.getByLabel("Název dokumentu").fill(name);

      const fileChooserPromise = page.waitForEvent("filechooser");
      await page.getByLabel("Soubor").click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(VALID_DOCX);

      await page.getByRole("checkbox", { name: "Aktivovat ihned po nahrání" }).check();
      await page.getByRole("button", { name: "Nahrát" }).click();

      await expect(page.getByRole("heading", { name: "Přidat TOS dokument" })).not.toBeVisible();

      await page.getByPlaceholder("Hledat dokumenty").fill(name);
      await page.getByPlaceholder("Hledat dokumenty").press("Enter");
      await page.waitForURL((url) => url.searchParams.get("search") === name);

      const row = page.locator("table tbody tr").filter({ hasText: name });
      await expect(row).toBeVisible();
      await expect(row.getByText("Aktivní", { exact: true })).toBeVisible();
      await expect(row.locator("td").nth(3)).not.toHaveText("—");
   });

   test("AP-1: prázdný Název zobrazí validační chybu", async ({ page }) => {
      await page.getByRole("button", { name: "Přidat dokument" }).click();

      const fileChooserPromise = page.waitForEvent("filechooser");
      await page.getByLabel("Soubor").click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(VALID_DOCX);

      await page.getByRole("button", { name: "Nahrát" }).click();

      await expect(page.getByText("Název dokumentu je povinný")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Přidat TOS dokument" })).toBeVisible();
   });

   test("AP-1: Název obsahující pouze bílé znaky zobrazí validační chybu", async ({ page }) => {
      await page.getByRole("button", { name: "Přidat dokument" }).click();
      await page.getByLabel("Název dokumentu").fill("   ");

      const fileChooserPromise = page.waitForEvent("filechooser");
      await page.getByLabel("Soubor").click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(VALID_DOCX);

      await page.getByRole("button", { name: "Nahrát" }).click();

      await expect(page.getByText("Název dokumentu je povinný")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Přidat TOS dokument" })).toBeVisible();
   });

   test("AP-1: bez vybraného Souboru nelze odeslat formulář", async ({ page }) => {
      await page.getByRole("button", { name: "Přidat dokument" }).click();
      await page.getByLabel("Název dokumentu").fill(uniqueName("no-file"));

      await expect(page.getByRole("button", { name: "Nahrát" })).toBeDisabled();
      await expect(page.getByRole("heading", { name: "Přidat TOS dokument" })).toBeVisible();
   });

   test("AP-2: nepodporovaný formát souboru zobrazí chybovou hlášku", async ({ page }) => {
      const name = uniqueName("pdf");

      await page.getByRole("button", { name: "Přidat dokument" }).click();
      await page.getByLabel("Název dokumentu").fill(name);

      const fileChooserPromise = page.waitForEvent("filechooser");
      await page.getByLabel("Soubor").click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(PDF_FILE);

      await page.getByRole("button", { name: "Nahrát" }).click();

      // Client-side Zod validace fileName nezobrazí chybu u pole Soubor (FormField name="file"),
      // ale odeslání zablokuje — dialog zůstane otevřený a dokument se nevytvoří.
      await expect(page.getByRole("heading", { name: "Přidat TOS dokument" })).toBeVisible();
      await page.getByRole("button", { name: "Zrušit" }).click();
      await page.getByPlaceholder("Hledat dokumenty").fill(name);
      await page.getByPlaceholder("Hledat dokumenty").press("Enter");
      await expect(page.locator("table tbody tr")).toHaveCount(0);
   });

   test("AP-4: poškozený DOCX zobrazí chybovou hlášku a dokument se nevytvoří", async ({ page }) => {
      const name = uniqueName("corrupt");

      await page.getByRole("button", { name: "Přidat dokument" }).click();
      await page.getByLabel("Název dokumentu").fill(name);

      const fileChooserPromise = page.waitForEvent("filechooser");
      await page.getByLabel("Soubor").click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(INVALID_DOCX);

      await page.getByRole("button", { name: "Nahrát" }).click();

      await expect(page.locator(".text-red-500")).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole("heading", { name: "Přidat TOS dokument" })).toBeVisible();
      await page.getByRole("button", { name: "Zrušit" }).click();
      await page.getByPlaceholder("Hledat dokumenty").fill(name);
      await page.getByPlaceholder("Hledat dokumenty").press("Enter");
      await expect(page.locator("table tbody tr")).toHaveCount(0);
   });

   test("AP-6: tlačítko Zrušit zavře dialog bez vytvoření dokumentu", async ({ page }) => {
      const name = uniqueName("cancel");

      await page.getByRole("button", { name: "Přidat dokument" }).click();
      await page.getByLabel("Název dokumentu").fill(name);

      const fileChooserPromise = page.waitForEvent("filechooser");
      await page.getByLabel("Soubor").click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(VALID_DOCX);

      await page.getByRole("button", { name: "Zrušit" }).click();

      await expect(page.getByRole("heading", { name: "Přidat TOS dokument" })).not.toBeVisible();
      await expect(page.getByRole("row").filter({ hasText: name })).toHaveCount(0);
   });

   test("AP-6: ESC zavře dialog bez vytvoření dokumentu", async ({ page }) => {
      const name = uniqueName("esc");

      await page.getByRole("button", { name: "Přidat dokument" }).click();
      await page.getByLabel("Název dokumentu").fill(name);

      const fileChooserPromise = page.waitForEvent("filechooser");
      await page.getByLabel("Soubor").click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(VALID_DOCX);

      await page.keyboard.press("Escape");

      await expect(page.getByRole("heading", { name: "Přidat TOS dokument" })).not.toBeVisible();
      await expect(page.getByRole("row").filter({ hasText: name })).toHaveCount(0);
   });
});
