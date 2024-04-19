import { test } from "@fixtures/walletExtension";
import { expect } from "@playwright/test";

test("Should prevent SQL injection in search fields", async ({ page }) => {
  await page.goto("/governance_actions");

  const sqlVulnerable = "' OR '1'='1";
  await page.getByTestId("search-input").fill(sqlVulnerable);

  await expect(
    page.getByText("There're any Governance Actions yet.")
  ).toBeVisible();
});
