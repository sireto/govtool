import { test } from "@fixtures/walletExtension";
import { expect } from "@playwright/test";

test("Should contain CSP header", async ({ page }) => {
  const response = await page.goto("/");
  expect(response.headers).toHaveProperty("content-security-policy");
});

test("Should handle CORS request properly", async ({ page, context }) => {
  const forbiddenOrigin = "https://another-origin.com";

  await page.setExtraHTTPHeaders({ Origin: forbiddenOrigin });
  const response = await page.goto("/governance_actions");
  expect(response.headers).toHaveProperty("access-control-allow-origin");
  expect(response.headers).not.toHaveProperty(
    "access-control-allow-origin",
    "*"
  );
});
