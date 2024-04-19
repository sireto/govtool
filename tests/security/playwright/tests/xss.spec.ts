import { test } from "@fixtures/walletExtension";
import { expect } from "@playwright/test";

const script = "<script>alert('XSS')</script>";

test.beforeEach(({ page }) => {
  page.on("dialog", async (dialog) => {
    if (dialog.type() === "alert") {
      expect(true).toBeFalsy();
    }
    dialog.accept();
  });
});

test("Input fields: Should prevent script from injection in input fields", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("register-button").click();

  await page.getByTestId("url-input").fill(script);
  await page.getByTestId("hash-input").fill(script);
});

test("Search fields: Should prevent script from injection in input fields", async ({
  page,
}) => {
  await page.goto("/governance_actions");

  await page.getByTestId("search-input").fill(script);
});

test("Should properly encode or escape user generated content", async ({
  page,
}) => {
  const maliciousContent =
    "<div>User-generated content with a <script>alert('XSS')</script></div>";
    
  page.route("**/proposal/list", async (route) => {
    const response = await route.fetch();
    const result = await response.json();

    const modifiedResult = [
      ...result,
      { ...result[0], type: maliciousContent },
    ];

    route.fulfill({
      status: response.status(),
      headers: response.headers(),
      body: JSON.stringify(modifiedResult),
    });
  });

  await page.goto("/governance_actions");
});
