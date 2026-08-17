import { chromium } from "@playwright/test";

export default async function globalSetup() {
   const browser = await chromium.launch();
   const page = await browser.newPage();

   await page.goto("http://localhost:3000/login");

   const email = process.env.E2E_EMAIL ?? "admin@praha10.cz";
   const password = process.env.E2E_PASSWORD ?? "Heslo.01";

   await page.getByRole("textbox", { name: "Email" }).fill(email);
   await page.getByRole("textbox", { name: "Heslo" }).fill(password);
   await page.getByRole("button", { name: "Přihlásit se", exact: true }).click();

   await page.waitForURL("http://localhost:3000/admin");

   await page.context().storageState({ path: "auth.json" });

   await browser.close();
}
