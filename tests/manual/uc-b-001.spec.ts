import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

test.describe("UC-B-001: Testování filtrace u TOS", () => {
   test("Stránika TOS je dostupná", async ({ page }) => {
      await page.goto("http://localhost:3000/admin/tos");

      await expect(page.getByRole("heading", { name: "TOS Dokumenty" })).toBeVisible();
   });

   test("Stránka obsahuje všechny komponenty vyhledávacího pole", async ({ page }) => {
      await page.goto("http://localhost:3000/admin/tos");

      var searchInput = page.getByRole('textbox', { name: 'Hledat dokumenty' });
      await expect(searchInput).toBeVisible();
      await expect(page.getByRole('button').nth(3)).toBeVisible();

      searchInput.fill('test');

      // Při vyplnění textu se zobrazuje tlačítko pro vymazání filtru a tlačítko pro vyhledávání
      await expect(page.getByRole('button').nth(3)).toBeVisible();
      await expect(page.getByRole('button').nth(4)).toBeVisible();
   });

   test("Při vyplnění filtru se nastaví filtr do query parametrů", async ({ page }) => {
      await page.goto("http://localhost:3000/admin/tos");

      var text = "this-is-test-input";

      await page.getByRole('textbox', { name: 'Hledat dokumenty' }).fill(text);
      await page.getByRole('button').nth(4).click();

      await page.waitForURL(url => url.toString().includes(`search`));
      // Při vyplnění textu se zobrazuje tlačítko pro vymazání filtru a tlačítko pro vyhledávání
      await expect(page).toHaveURL(url => url.toString().includes(`search=${text}`));
   });

   test("Při vyplnění filtru se nastaví page na 1", async ({ page }) => {
      await page.goto("http://localhost:3000/admin/tos?page=2");

      var text = "this-is-test-input";

      await page.getByRole('textbox', { name: 'Hledat dokumenty' }).fill(text);
      await page.getByRole('button').nth(4).click();

      await page.waitForURL(url => url.toString().includes(`search`));
      // Při vyplnění textu se zobrazuje tlačítko pro vymazání filtru a tlačítko pro vyhledávání
      await expect(page).toHaveURL(url => url.toString().includes(`page=1`));
   });

   test("Při filtrace se zobrazí pouze filtrované výsledky", async ({ page }) => {
      await page.goto("http://localhost:3000/admin/tos");

      var text = "TOS-";

      await page.getByRole('textbox', { name: 'Hledat dokumenty' }).fill(text);
      await page.getByRole('button').nth(4).click();

      await page.waitForURL(url => url.toString().includes(`search`));
      // Při vyplnění textu se zobrazuje tlačítko pro vymazání filtru a tlačítko pro vyhledávání
      await expect(page).toHaveURL(url => url.toString().includes(`page=1`));

      const count = await page.locator("table tbody tr").count();
      
      expect(count).toBe(3);
   });

   test("Query parametr search se propíše do filtračního pole", async ({ page }) => {
      await page.goto("http://localhost:3000/admin/tos?search=TOS-1");

      await expect(page.getByRole('textbox', { name: 'Hledat dokumenty' })).toHaveValue("TOS-1");
   });

   test("Query parametr search se propíše do filtračního pole a filtrace se provede", async ({ page }) => {
      await page.goto("http://localhost:3000/admin/tos?search=TOS-1");

      await expect(page.getByRole('textbox', { name: 'Hledat dokumenty' })).toHaveValue("TOS-1");

      const count = await page.locator("table tbody tr").count();
      
      expect(count).toBe(1);
   });

   test("Filtrace bez výsledků", async ({ page }) => {
      await page.goto("http://localhost:3000/admin/tos?search=nonexistent");

      const count = await page.locator("table tbody tr").count();
      
      expect(count).toBe(0);
   });

   test("Odstranění filtrace odstraní query parametr search", async ({ page }) => {
      await page.goto("http://localhost:3000/admin/tos?search=TOS-1");

      await expect(page.getByRole('button').nth(3)).toBeVisible();
      await expect(page.getByRole('button').nth(4)).toBeVisible();

      await page.getByRole('button').nth(3).click();

      await page.waitForURL(url => !url.toString().includes(`search`));

      // Při vyplnění textu se zobrazuje tlačítko pro vymazání filtru a tlačítko pro vyhledávání
      await expect(page).toHaveURL(url => url.toString().includes(`page=1`));
   });
});