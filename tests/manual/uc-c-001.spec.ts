import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

test.describe("UC-C-001: Testování vytvoření nového TOS dokumentu", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:3000/admin/tos");
   });

   test("Zobrazení tlačítka pro vytvoření nového TOS dokumentu", async ({ page }) => {
      await expect(page.getByRole("button", { name: "Přidat dokument", exact: true })).toBeVisible();
   });

   test("Zobrazení dialogu pro vytvoření nového TOS dokumentu", async ({ page }) => {
      await page.getByRole("button", { name: "Přidat dokument", exact: true }).click();

      await expect(page.getByRole("heading", { name: "Přidat TOS dokument" })).toBeVisible();
      await expect(page.getByRole("textbox", { name: "Název dokumentu" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Soubor" })).toBeVisible();
      await expect(page.getByText("Aktivovat ihned po nahrání")).toBeVisible();
      await expect(page.getByRole("button", { name: "Zrušit" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Nahrát" })).toBeVisible();
   });

   test("Happy day scénař", async ({ page }) => {
      await page.getByRole("button", { name: "Přidat dokument", exact: true }).click();

      var tosName = `Testovací TOS dokument (${Date.now()})`;
      var fileName = "cbe259ba-00c4-4462-b00c-721c675f2e62.docx";
      await page.getByRole("textbox", { name: "Název dokumentu" }).fill(tosName);

      const fileChooserPromise = page.waitForEvent("filechooser");
      await page.getByRole("button", { name: "Soubor" }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(__dirname, fileName));
      await page.getByRole("button", { name: "Nahrát" }).click();

      var tableRow = page.getByRole("row").filter({ hasText: tosName });

      await expect(page.getByRole("heading", { name: "Přidat TOS dokument" })).toBeHidden();
      await expect(tableRow).toBeVisible();
      await expect(tableRow.getByRole("cell", { name: tosName, exact: true })).toBeVisible();
      await expect(tableRow.getByRole("cell", { name: fileName })).toBeVisible();
      await expect(tableRow.locator("td:nth-child(9) > .flex > button:nth-child(4)")).toBeVisible();
   });

   test("AP-1 špatný soubor", async ({ page }) => {
      await page.getByRole("button", { name: "Přidat dokument", exact: true }).click();

      var tosName = `Testovací TOS dokument (${Date.now()})`;
      var fileName = "test.pdf";

      await page.getByRole("textbox", { name: "Název dokumentu" }).fill(tosName);
      const fileChooserPromise = page.waitForEvent("filechooser");
      await page.getByRole("button", { name: "Soubor" }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(__dirname, fileName));

      await page.getByRole("button", { name: "Nahrát" }).click();

      await expect(page.getByRole("heading", { name: "Přidat TOS dokument" })).toBeVisible();
   });

   test("AP-2 Nevyplněný název", async ({ page }) => {
      await page.getByRole("button", { name: "Přidat dokument", exact: true }).click();

      var tosName = ``;
      var fileName = "cbe259ba-00c4-4462-b00c-721c675f2e62.docx";

      await page.getByRole("textbox", { name: "Název dokumentu" }).fill(tosName);
      const fileChooserPromise = page.waitForEvent("filechooser");
      await page.getByRole("button", { name: "Soubor" }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(__dirname, fileName));

      await page.getByRole("button", { name: "Nahrát" }).click();

      await expect(page.getByText("Název dokumentu je povinný")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Přidat TOS dokument" })).toBeVisible();
   });

   test("AP-3 Uživatel aktivuje dokument", async ({ page }) => {
      await page.getByRole("button", { name: "Přidat dokument", exact: true }).click();

      var tosName = `Testovací TOS dokument (${Date.now()})`;
      var fileName = "cbe259ba-00c4-4462-b00c-721c675f2e62.docx";

      await page.getByRole("textbox", { name: "Název dokumentu" }).fill(tosName);
      const fileChooserPromise = page.waitForEvent("filechooser");
      await page.getByRole("button", { name: "Soubor" }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(__dirname, fileName));
      await page.getByRole("checkbox", { name: "Aktivovat ihned po nahrání" }).click();

      await page.getByRole("button", { name: "Nahrát" }).click();

      var tableRow = page.getByRole("row").filter({ hasText: tosName });

      await expect(page.getByRole("heading", { name: "Přidat TOS dokument" })).toBeHidden();
      await expect(tableRow).toBeVisible();
      await expect(tableRow.getByRole("cell", { name: tosName, exact: true })).toBeVisible();
      await expect(tableRow.getByRole("cell", { name: fileName })).toBeVisible();
      await expect(tableRow.locator("td:nth-child(9) > .flex > button:nth-child(4)")).toBeHidden();
      await expect(tableRow.getByText("Aktivní")).toBeVisible();
   });
});
