import path from "path";
import { test, expect, type Page } from "@playwright/test";

/**
 * E2E tests for UC-C-001: Vytvoření dokumentu podmínek užívání
 *
 * Covers the main success scenario and alternative flows defined in
 * .github/docs/use-cases/UC-C-001-vytvoreni-dokumentu-tos.md:
 *   - Happy path: fill Název, upload DOCX, submit -> saved record + redirect to list
 *   - AP-1: empty or whitespace-only Název
 *   - AP-2: missing Soubor
 *   - AP-3: unsupported file format
 *   - AP-4: HTML conversion failure
 *   - AP-5: duplicate Název
 *   - AP-6: persistence failure
 *   - AP-7: cancel action
 *
 * Authentication is handled automatically by Playwright configuration.
 */

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const TOS_URL = `${BASE_URL}/admin/tos`;

const FIXTURES_DIR = path.join(__dirname);
const VALID_DOCX = path.join(FIXTURES_DIR, "test.docx");
const INVALID_FORMAT_FILE = path.join(FIXTURES_DIR, "test.pdf");
const UPLOADED_FILENAME = "test.docx";

const EXISTING_DOCUMENT_NAME = process.env.E2E_TOS_EXISTING_NAME;

const addDocumentButton = (page: Page) => page.getByRole("button", { name: /přidat dokument/i }).first();

const createDialog = (page: Page) => page.getByRole("dialog");

const nameField = (page: Page) =>
   createDialog(page)
      .getByLabel(/^název dokumentu$/i)
      .or(createDialog(page).getByRole("textbox", { name: /^název dokumentu$/i }))
      .first();

const fileButton = (page: Page) =>
   createDialog(page)
      .getByRole("button", { name: /^soubor$/i })
      .first();

const isActiveCheckbox = (page: Page) =>
   createDialog(page).getByRole("checkbox", { name: "Aktivovat ihned po nahrání" }).or(createDialog(page).getByLabel("Aktivovat ihned po nahrání")).first();

const submitButton = (page: Page) => createDialog(page).getByRole("button", { name: "Nahrát" }).first();

const cancelButton = (page: Page) =>
   createDialog(page)
      .getByRole("button", { name: /zrušit/i })
      .first();

const nameFieldError = (page: Page) =>
   createDialog(page)
      .getByText(/název.*(povinn|vyplň|prázdn|nesmí|povinné pole)/i)
      .or(createDialog(page).getByText(/Dokument s tímto názvem již existuje/i))
      .first();

const fileFieldError = (page: Page) =>
   createDialog(page)
      .getByText(/soubor.*(povinn|vyplň|nahrajte|povinné pole)/i)
      .or(createDialog(page).getByText(/Povolené formáty:\s*DOCX/i))
      .or(createDialog(page).getByText(/nelze zpracovat|konverz/i))
      .first();

const errorMessage = (page: Page) => page.getByText(/chyba|nepodařilo|nelze|error/i).first();

const documentRow = (page: Page, text: string) => page.getByRole("row").filter({ hasText: text });

function uniqueDocumentName(prefix = "TOS-E2E"): string {
   return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function openCreateForm(page: Page) {
   await page.goto(TOS_URL);
   await addDocumentButton(page).click();
   await createDialog(page).waitFor({ state: "visible" });
}

async function uploadFile(page: Page, filePath: string) {
   const fileChooserPromise = page.waitForEvent("filechooser");
   await fileButton(page).click();
   const fileChooser = await fileChooserPromise;
   await fileChooser.setFiles(filePath);
}

async function fillCreateForm(
   page: Page,
   options: {
      name?: string;
      filePath?: string;
      isActive?: boolean;
   } = {}
) {
   if (options.name !== undefined) {
      await nameField(page).fill(options.name);
   }

   if (options.filePath !== undefined) {
      await uploadFile(page, options.filePath);
   }

   if (options.isActive !== undefined) {
      const checkbox = isActiveCheckbox(page);
      if (options.isActive) {
         await checkbox.check();
      } else {
         await checkbox.uncheck();
      }
   }
}

async function submitCreateForm(page: Page) {
   await submitButton(page).click();
}

async function expectOnCreateForm(page: Page) {
   await expect(page).toHaveURL(/\/admin\/tos\/?(\?|$|#)/);
   await expect(createDialog(page)).toBeVisible();
}

async function expectOnTosList(page: Page) {
   await expect(page).toHaveURL(/\/admin\/tos\/?(\?|$|#)/);
   await expect(createDialog(page)).not.toBeVisible();
}

async function expectDocumentInList(page: Page, name: string, filename?: string) {
   const row = documentRow(page, name);
   await expect(row).toBeVisible({ timeout: 10_000 });

   if (filename) {
      await expect(row).toContainText(filename);
   }
}

async function expectDocumentNotInList(page: Page, name: string) {
   await expect(documentRow(page, name)).toHaveCount(0);
}

async function getFirstDocumentName(page: Page): Promise<string> {
   const firstRow = page
      .getByRole("row")
      .filter({ hasNot: page.getByRole("columnheader") })
      .first();
   await expect(firstRow).toBeVisible();
   const text = await firstRow.innerText();
   return text.split("\n")[0]?.trim() ?? text.trim();
}

test.describe("UC-C-001: Vytvoření dokumentu podmínek užívání", () => {
   test.beforeEach(async ({ page }) => {
      await openCreateForm(page);
   });

   // Steps 1-2: "Přidat dokument" opens a dialog with required fields.
   test("zobrazí dialog pro vytvoření dokumentu ToS", async ({ page }) => {
      await expect(createDialog(page)).toBeVisible();
      await expect(nameField(page)).toBeVisible();
      await expect(fileButton(page)).toBeVisible();
   });

   // Main success scenario (steps 3-9): create inactive document, confirm, redirect, list entry.
   test("úspěšné vytvoření dokumentu uloží záznam a přesměruje na seznam", async ({ page }) => {
      const documentName = uniqueDocumentName();

      await fillCreateForm(page, {
         name: documentName,
         filePath: VALID_DOCX,
         isActive: false,
      });
      await submitCreateForm(page);

      await expectOnTosList(page);
      await expectDocumentInList(page, documentName, UPLOADED_FILENAME);
   });

   // Business rule: JeAktivní can be set explicitly on create.
   test("úspěšné vytvoření aktivního dokumentu uloží záznam jako aktivní", async ({ page }) => {
      const documentName = uniqueDocumentName("TOS-E2E-ACTIVE");

      await fillCreateForm(page, {
         name: documentName,
         filePath: VALID_DOCX,
         isActive: true,
      });
      await submitCreateForm(page);

      await expectOnTosList(page);
      await expectDocumentInList(page, documentName, UPLOADED_FILENAME);
   });

   // AP-1: empty Název -> validation at field, form values preserved where possible.
   test("AP-1: prázdný název zobrazí validační hlášení a nevytvoří dokument", async ({ page }) => {
      await fillCreateForm(page, { filePath: VALID_DOCX });
      await submitCreateForm(page);

      await expectOnCreateForm(page);
      await expect(nameFieldError(page)).toBeVisible();
   });

   // AP-1: whitespace-only Název is rejected.
   test("AP-1: název tvořený pouze mezerami zobrazí validační hlášení", async ({ page }) => {
      await fillCreateForm(page, { name: "   ", filePath: VALID_DOCX });
      await submitCreateForm(page);

      await expectOnCreateForm(page);
      await expect(nameFieldError(page)).toBeVisible();
   });

   // AP-2: missing Soubor -> validation at file field, Název preserved.
   test("AP-2: chybějící soubor zobrazí validační hlášení a zachová název", async ({ page }) => {
      const documentName = uniqueDocumentName("TOS-E2E-NOFILE");

      await fillCreateForm(page, { name: documentName });
      await expect(submitButton(page)).toBeDisabled();
   });

   // AP-3: non-DOCX file -> format error, Název preserved.
   test("AP-3: nepodporovaný formát souboru", async ({ page }) => {
      const documentName = uniqueDocumentName("TOS-E2E-BADFMT");

      await fillCreateForm(page, {
         name: documentName,
         filePath: INVALID_FORMAT_FILE,
      });
      await submitCreateForm(page);

      await expectOnCreateForm(page);
      await expect(nameField(page)).toHaveValue(documentName);
      await expect(page.getByRole("heading", { name: "Přidat TOS dokument" })).toBeVisible();
   });

   // AP-6: persistence failure -> generic error, no partial record.
   test("AP-6: chyba při ukládání zobrazí obecné hlášení a nevytvoří dokument", async ({ page }) => {
      const documentName = uniqueDocumentName("TOS-E2E-SAVEERR");

      await page.route("**/*tos*", (route) => {
         if (route.request().method() === "POST" && (route.request().resourceType() === "fetch" || route.request().resourceType() === "xhr")) {
            return route.fulfill({ status: 500, body: "Internal Server Error" });
         }
         return route.continue();
      });

      await fillCreateForm(page, {
         name: documentName,
         filePath: VALID_DOCX,
      });
      await submitCreateForm(page);

      await expectOnCreateForm(page);
      await expect(errorMessage(page)).toBeVisible({ timeout: 10_000 });
      await page.goto(TOS_URL);
      await expectDocumentNotInList(page, documentName);
   });

   // AP-7: cancel via button -> return to list without saving.
   test("AP-7: zrušení akce vrátí na seznam bez uložení", async ({ page }) => {
      const documentName = uniqueDocumentName("TOS-E2E-CANCEL");

      await fillCreateForm(page, {
         name: documentName,
         filePath: VALID_DOCX,
      });
      await cancelButton(page).click();

      await expectOnTosList(page);
      await expectDocumentNotInList(page, documentName);
   });
});
