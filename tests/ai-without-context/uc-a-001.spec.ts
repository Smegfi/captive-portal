import { test, expect, type Page } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

/**
 * E2E tests for UC-A-001: Přihlášení uživatele (User login)
 *
 * Covers the main success scenario and the alternative flows defined in
 * .github/docs/use-cases/UC-A-001-prihlaseni-uzivatele.md:
 *   - Happy path: valid credentials -> authenticated session + redirect to admin
 *   - AP-1: missing required fields (email and/or password)
 *   - AP-2: invalid credentials -> generic error, no session
 *   - AP-3: accessing a protected page without a session -> redirect to /login
 */

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const LOGIN_URL = `${BASE_URL}/login`;

// Credentials are configurable via env so the suite can run against any environment.
const VALID_EMAIL = process.env.E2E_EMAIL ?? '';
const VALID_PASSWORD = process.env.E2E_PASSWORD ?? '';

const emailField = (page: Page) =>
  page.getByRole('textbox', { name: /e-?mail/i }).or(page.locator('input[type="email"]')).first();

const passwordField = (page: Page) =>
  page.getByLabel(/heslo|password/i).or(page.locator('input[type="password"]')).first();

const loginButton = (page: Page) =>
  page.getByRole('button', { name: /přihlásit se|přihlásit|login|sign in/i }).first();

test.describe('UC-A-001: Přihlášení uživatele', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  // Step 1-2: login page is reachable and the form is rendered.
  test('zobrazí přihlašovací formulář s poli a tlačítkem', async ({ page }) => {
    await expect(emailField(page)).toBeVisible();
    await expect(passwordField(page)).toBeVisible();
    await expect(loginButton(page)).toBeVisible();
  });

  // Main success scenario (steps 3-6): valid credentials create a session and redirect to admin.
  test('úspěšné přihlášení s platnými údaji přesměruje do administrace', async ({ page }) => {
    await emailField(page).fill(VALID_EMAIL);
    await passwordField(page).fill(VALID_PASSWORD);
    await loginButton(page).click();

    // User must leave the login page (redirected to admin / requested protected page).
    await expect(page).not.toHaveURL(/\/login\b/, { timeout: 10_000 });
  });

  // AP-1: required fields are not filled in -> form must not be submitted successfully.
  test('AP-1: odeslání prázdného formuláře zobrazí validační hlášení', async ({ page }) => {
    await loginButton(page).click();

    // No session is created -> the user stays on the login page.
    await expect(page).toHaveURL(/\/login\b/);

    // Both fields show their validation messages.
    await expect(page.getByText('Email musí být ve správném formátu')).toBeVisible();
    await expect(page.getByText('Heslo musí mít alespoň 8 znaků')).toBeVisible();
  });

  // AP-1: only the email is provided, password is missing.
  test('AP-1: chybějící heslo zobrazí validační hlášení u hesla', async ({ page }) => {
    await emailField(page).fill(VALID_EMAIL);
    await loginButton(page).click();

    await expect(page).toHaveURL(/\/login\b/);

    // The password field shows its validation message.
    await expect(page.getByText('Heslo musí mít alespoň 8 znaků')).toBeVisible();
  });

  // AP-2: invalid credentials -> generic error and no authenticated session.
  test('AP-2: nesprávné údaje zobrazí obecnou chybu a nepřihlásí uživatele', async ({ page }) => {
    await emailField(page).fill('neexistujici@example.com');
    await passwordField(page).fill('spatneHeslo!');
    await loginButton(page).click();

    // The user remains on the login page without a session.
    await expect(page).toHaveURL(/\/login\b/);

    // A generic error message is shown (it must not reveal which field is wrong).
    const error = page
      .getByText(/nesprávn|neplatn|chyb|invalid|incorrect/i)
      .first();
    await expect(error).toBeVisible();
  });

  // AP-3: accessing a protected admin page without a session redirects to /login.
  test('AP-3: přístup do administrace bez relace přesměruje na přihlášení', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);

    await expect(page).toHaveURL(/\/login\b/);
    await expect(loginButton(page)).toBeVisible();
  });
});
