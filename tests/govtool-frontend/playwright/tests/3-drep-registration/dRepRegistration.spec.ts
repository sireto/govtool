import { setAllureEpic } from "@helpers/allure";
import { test, expect } from "@playwright/test";

test.beforeEach(async () => {
  await setAllureEpic("3. DRep registration");
});

test("3C. Should open wallet connection popup, when Register as DRep from wallet unconnected state", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByTestId("register-connect-wallet-button").click();
  await expect(page.getByTestId("connect-your-wallet-modal")).toBeVisible();
});
