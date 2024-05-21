import { user01Wallet } from "@constants/staticWallets";
import { test } from "@fixtures/walletExtension";
import { setAllureEpic } from "@helpers/allure";
import ProposalSubmission from "@pages/proposalSubmissionPage";
import { expect } from "@playwright/test";
import { ProposalType } from "@types";

test.beforeEach(async () => {
  await setAllureEpic("7. Proposal submission");
});

test.use({ storageState: ".auth/user01.json", wallet: user01Wallet });

test("7B. Should access proposal submission page", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("propose-governance-actions-button").click();

  await expect(
    page.getByText("Create a Governance Action", { exact: true })
  ).toBeVisible();
});

test("7C. Should list governance action types", async ({ page }) => {
  const proposalSubmissionPage = new ProposalSubmission(page);
  await proposalSubmissionPage.goto();

  await expect(proposalSubmissionPage.infoRadioButton).toBeVisible();
  await expect(proposalSubmissionPage.treasuryRadioButton).toBeVisible();
});
test.describe("Verify Proposal form", () => {
  const type: Array<ProposalType> = ["Info", "Treasury"];
  const buttons = ["infoRadioButton", "treasuryRadioButton"];
  for (let j = 0; j < type.length; j++) {
    test(`7D.${j + 1}: Verify ${type[j].toLocaleLowerCase()} proposal form`, async ({
      page,
    }) => {
      const proposalSubmissionPage = new ProposalSubmission(page);
      await proposalSubmissionPage.goto();

      await proposalSubmissionPage[buttons[j]].click();
      await proposalSubmissionPage.continueBtn.click();

      await expect(proposalSubmissionPage.titleInput).toBeVisible();
      await expect(proposalSubmissionPage.abstractInput).toBeVisible();
      await expect(proposalSubmissionPage.motivationInput).toBeVisible();
      await expect(proposalSubmissionPage.rationaleInput).toBeVisible();
      await expect(proposalSubmissionPage.addLinkBtn).toBeVisible();
      if (type[j] === "Treasury") {
        await expect(
          proposalSubmissionPage.receivingAddressInput
        ).toBeVisible();

        await expect(proposalSubmissionPage.amountInput).toBeVisible();
      }
    });
  }
});
