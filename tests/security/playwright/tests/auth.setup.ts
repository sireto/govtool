// Saves storage state to a file in the .auth directory
import { userWallet } from "@lib/constants/wallets";
import { importWallet } from "@lib/fixtures/importWallet";
import loadDemosExtension from "@lib/fixtures/loadDemosExtension";
import LoginPage from "@lib/pages/loginPage";
import { test as setup } from "@playwright/test";

const userAuthFile = ".auth/user.json";

setup("Create User auth", async ({ page }) => {
  await loadDemosExtension(page);
  await importWallet(page, userWallet);

  const loginPage = new LoginPage(page);
  await loginPage.login();

  await page.context().storageState({ path: userAuthFile });
});
