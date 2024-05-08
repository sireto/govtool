import { Page } from "@playwright/test";

export function isMobile(page: Page) {
  const { width } = page.viewportSize();
  if (width <= 414) return true;

  return false;
}

export async function openDrawer(page: Page) {
  await page.getByRole("img", { name: "drawer-icon" }).click(); //BUG testId
}

export async function openDrawerLoggedIn(page: Page) {
  await page.getByTestId("open-drawer-button").click();
}
