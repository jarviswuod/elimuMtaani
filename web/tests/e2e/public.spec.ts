import { test, expect } from "@playwright/test";

test.describe("Public pages", () => {
  test("landing page renders with correct title and demo section", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/elimuMtaani/i);
    await expect(page.locator("h1")).toContainText("teach");
    await expect(page.locator("#demo")).toBeVisible();
    await expect(page.locator("#demo")).toContainText("Demo Teacher");
    await expect(page.locator("#demo")).toContainText("Demo Student");
  });

  test("header About link navigates to /about", async ({ page }) => {
    await page.goto("/");
    await page.click("a[href='/about']");
    await expect(page).toHaveURL(/\/about/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("/about renders mission content", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("main")).toContainText("CBC");
  });

  test("protected /teacher route redirects unauthenticated users", async ({ page }) => {
    await page.goto("/teacher");
    await expect(page).not.toHaveURL(/\/teacher$/);
  });

  test("protected /student route redirects unauthenticated users", async ({ page }) => {
    await page.goto("/student");
    await expect(page).not.toHaveURL(/\/student$/);
  });
});
