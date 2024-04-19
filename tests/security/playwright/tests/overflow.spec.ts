import { test } from "@fixtures/walletExtension";

const longInput = "a".repeat(1500);

test("Input fields: Should reject excessively long inputs", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("register-button").click();

  await page.getByTestId("url-input").fill(longInput);
  await page.getByTestId("hash-input").fill(longInput);
});

test("Search fields: Should reject excessively long inputs", async ({
  page,
}) => {
  await page.goto("/governance_actions");

  await page.getByTestId("search-input").fill(longInput);
});
