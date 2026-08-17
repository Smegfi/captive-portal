import { expect, test, type Page } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

/**
 * E2E test for UC-A-001: Přihlášení uživatele
 * @see .github/docs/use-cases/ai-with-context/uc-a-001.md
 *
 * Login page: http://localhost:3000/login
 *  - Email field (label "Email")
 *  - Password field (label "Heslo")
 *  - Submit button "Přihlásit se"
 *
 * Validation (Zod LoginSchema):
 *  - Email must be a valid email format
 *  - Password must be at least 8 characters
 *
 * Valid credentials for the success scenario are provided via env vars,
 * so the test does not depend on hard-coded accounts:
 *  - E2E_EMAIL
 *  - E2E_PASSWORD
 */

const LOGIN_URL = "http://localhost:3000/login";

const emailField = (page: Page) => page.getByLabel("Email");
const passwordField = (page: Page) => page.getByLabel("Heslo");
const submitButton = (page: Page) => page.getByRole("button", { name: "Přihlásit se", exact: true });

test.describe("UC-A-001: Přihlášení uživatele", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto(LOGIN_URL);
   });

   test("Krok 2: zobrazí přihlašovací formulář s poli E-mail a Heslo", async ({ page }) => {
      await expect(page.getByRole("heading", { name: "Přihlásit se" })).toBeVisible();
      await expect(emailField(page)).toBeVisible();
      await expect(passwordField(page)).toBeVisible();
      await expect(submitButton(page)).toBeVisible();
   });

   test("AP-1: nevyplněná pole zobrazí validační chyby a uživatel zůstane na /login", async ({ page }) => {
      await submitButton(page).click();

      await expect(page.getByText("Email musí být ve správném formátu")).toBeVisible();
      await expect(page.getByText("Heslo musí mít alespoň 8 znaků")).toBeVisible();
      await expect(page).toHaveURL(/\/login/);
   });

   test("AP-1: neplatný formát e-mailu zobrazí validační chybu", async ({ page }) => {
      await emailField(page).fill("neplatny-email");
      await passwordField(page).fill("dostatecneDlouheHeslo");
      await submitButton(page).click();

      await expect(page.getByText("Email musí být ve správném formátu")).toBeVisible();
      await expect(page).toHaveURL(/\/login/);
   });

   test("AP-1: příliš krátké heslo zobrazí validační chybu", async ({ page }) => {
      await emailField(page).fill("uzivatel@example.com");
      await passwordField(page).fill("krátké");
      await submitButton(page).click();

      await expect(page.getByText("Heslo musí mít alespoň 8 znaků")).toBeVisible();
      await expect(page).toHaveURL(/\/login/);
   });

   test("AP-2: nesprávné přihlašovací údaje zobrazí chybovou notifikaci", async ({ page }) => {
      await emailField(page).fill("neexistujici@example.com");
      await passwordField(page).fill("spatneHeslo123");
      await submitButton(page).click();

      // Better Auth chyba je zobrazena jako sonner toast.
      await expect(page.locator("[data-sonner-toast]")).toBeVisible();
      await expect(page).toHaveURL(/\/login/);
   });

   test("Scénář úspěšného průchodu: přihlášení a přesměrování do /admin", async ({ page }) => {
      const email = process.env.E2E_EMAIL;
      const password = process.env.E2E_PASSWORD;

      test.skip(!email || !password, "Nastavte E2E_EMAIL a E2E_PASSWORD pro test úspěšného přihlášení.");

      await emailField(page).fill(email!);
      await passwordField(page).fill(password!);
      await submitButton(page).click();

      await expect(page).toHaveURL(/\/admin/);
   });

   test("AP-3: nepřihlášený uživatel je z /admin přesměrován na /login", async ({ page }) => {
      await page.goto("http://localhost:3000/admin");

      await expect(page).toHaveURL(/\/login/);
   });

   test("AP-4: již přihlášený uživatel je při návštěvě /login přesměrován do /admin", async ({ page }) => {
      const email = process.env.E2E_EMAIL;
      const password = process.env.E2E_PASSWORD;

      test.skip(!email || !password, "Nastavte E2E_EMAIL a E2E_PASSWORD pro test již přihlášeného uživatele.");

      // Přihlášení a vytvoření platné relace.
      await emailField(page).fill(email!);
      await passwordField(page).fill(password!);
      await submitButton(page).click();
      await expect(page).toHaveURL(/\/admin/);

      // Opětovná návštěva /login s platnou relací → přesměrování do /admin.
      await page.goto(LOGIN_URL);
      await expect(page).toHaveURL(/\/admin/);
   });

   test("Parametr redirectTo: po přihlášení je uživatel přesměrován na původně požadovanou URL", async ({ page }) => {
      const email = process.env.E2E_EMAIL;
      const password = process.env.E2E_PASSWORD;

      test.skip(!email || !password, "Nastavte E2E_EMAIL a E2E_PASSWORD pro test parametru redirectTo.");

      const redirectTo = "/admin/settings";
      await page.goto(`${LOGIN_URL}?redirectTo=${encodeURIComponent(redirectTo)}`);

      await emailField(page).fill(email!);
      await passwordField(page).fill(password!);
      await submitButton(page).click();

      await expect(page).toHaveURL(new RegExp(`${redirectTo}$`));
   });
});
