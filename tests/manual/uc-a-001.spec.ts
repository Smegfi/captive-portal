import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
   await page.goto("http://localhost:3000/login");
});

test("Zobrazení přihlašovací stránky", async ({ page }) => {
   await expect(page.getByRole("heading", { name: "Přihlásit se" })).toBeVisible();
   await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
   await expect(page.getByRole("textbox", { name: "Heslo" })).toBeVisible();
   await expect(page.getByRole("button", { name: "Přihlásit se", exact: true })).toBeVisible();
});

test("Testování validace", async ({ page }) => {
   await page.getByRole("textbox", { name: "Email" }).fill("test");
   await page.getByRole("textbox", { name: "Heslo" }).fill("test");
   await page.getByRole("button", { name: "Přihlásit se", exact: true }).click();

   await expect(page.getByText("Email musí být ve správném formátu")).toBeVisible();
   await expect(page.getByText("Heslo musí mít alespoň 8 znaků")).toBeVisible();
});

test("Chybné údaje", async ({ page }) => {
   await page.getByRole("textbox", { name: "Email" }).fill("test@nesmysl.com");
   await page.getByRole("textbox", { name: "Heslo" }).fill("NeexistujícíHeslo.01");
   await page.getByRole("button", { name: "Přihlásit se", exact: true }).click();

   await expect(page.getByText("Invalid email or password")).toBeVisible();
});

test("Přihlášení uživatele", async ({ page }) => {
   const email = "tomas@jedno.cz";
   const password = "Heslo.01";
   const authCookieName = "better-auth.session_token";

   await page.getByRole("textbox", { name: "Email" }).fill(email);
   await page.getByRole("textbox", { name: "Heslo" }).fill(password);
   await page.getByRole("button", { name: "Přihlásit se", exact: true }).click();

   await expect(page.getByRole("heading", { name: "Přehled" })).toBeVisible();
   await expect(page).toHaveURL("http://localhost:3000/admin");

   const cookies = await page.context().cookies();
   const authCookie = cookies.find((x) => x.name === authCookieName);
   await expect(authCookie).toBeDefined();
});

test("Neautentifikovaný uživatel přesměřování na login", async ({ page }) => {
   await page.goto("http://localhost:3000/admin");

   await expect(page).toHaveURL("http://localhost:3000/login")
});

test("Redirect to logika", async ({ page }) => {
   await page.goto("http://localhost:3000/admin/settings");

   await expect(page).toHaveURL("http://localhost:3000/login?redirectTo=%2Fadmin%2Fsettings")

   const email = "tomas@jedno.cz";
   const password = "Heslo.01";
   const authCookieName = "better-auth.session_token";

   await page.getByRole("textbox", { name: "Email" }).fill(email);
   await page.getByRole("textbox", { name: "Heslo" }).fill(password);
   await page.getByRole("button", { name: "Přihlásit se", exact: true }).click();

   await expect(page).toHaveURL("http://localhost:3000/admin/settings");
});
