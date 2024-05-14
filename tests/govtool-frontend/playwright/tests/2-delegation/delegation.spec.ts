import { setAllureEpic } from "@helpers/allure";
import { expect, test } from "@playwright/test";

test.beforeEach(async () => {
  await setAllureEpic("2. Delegation");
});
test("2C. Verify DRep Behavior in Disconnected State", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("delegate-connect-wallet-button").click();
  await page
    .locator('[data-testid$="-connect-to-delegate-button"]')
    .first()
    .click();
  await expect(page.getByTestId("connect-your-wallet-modal")).toBeVisible();
});
