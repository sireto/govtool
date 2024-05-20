import {user01Wallet} from "@constants/staticWallets";
import {test} from "@fixtures/walletExtension";
import {expect} from "@playwright/test";
import {setAllureEpic} from "@helpers/allure";
import DRepDirectoryPage from "@pages/dRepDirectoryPage";

test.use({storageState: ".auth/user01.json", wallet: user01Wallet});

test.beforeEach(async () => {
    await setAllureEpic("6. Miscellaneous");
});
// Skipped: No dRepId to validate
test("6B. Provides error for invalid format", async ({page}) => {
    test.skip();
    // invalid dRep delegation
    const dRepDirectoryPage = new DRepDirectoryPage(page);
    await dRepDirectoryPage.goto();
    await dRepDirectoryPage.delegateToDRep("Random values");
    await expect(dRepDirectoryPage.delegationErrorModal).toBeVisible();

    // await dRepRegistrationPage.urlInput.fill("abc");
    // await expect(dRepRegistrationPage.urlInputError).toBeVisible();

    // await dRepRegistrationPage.hashInput.fill("abc");
    // await expect(dRepRegistrationPage.hashInputError).toBeVisible();
});

test("6D: Proper label and recognition of the testnet network", async ({
                                                                           page,
                                                                       }) => {
    await page.goto("/");

    await expect(page.getByText("testnet")).toBeVisible();
});
