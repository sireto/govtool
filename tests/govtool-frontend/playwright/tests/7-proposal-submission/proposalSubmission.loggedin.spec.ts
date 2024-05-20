import environments from "@constants/environments";
import { user01Wallet } from "@constants/staticWallets";
import { test } from "@fixtures/walletExtension";
import { setAllureEpic } from "@helpers/allure";
import { generateProposalFormField } from "@helpers/governanceAction";
import ProposalSubmission from "@pages/proposalSubmissionPage";
import { expect } from "@playwright/test";
import { bech32 } from "bech32";

test.use({ storageState: ".auth/user01.json", wallet: user01Wallet });

test.beforeEach(async () => {
  await setAllureEpic("7. Proposal submission");
});

test("7F. Should accept valid data in info proposal", async ({ page }) => {
  test.slow();
  const proposalSubmissionPage = new ProposalSubmission(page);
  await proposalSubmissionPage.goto();
  await proposalSubmissionPage.infoRadioButton.click();
  await proposalSubmissionPage.continueBtn.click();

  for (let i = 0; i < 100; i++) {
    await proposalSubmissionPage.validateForm(
      generateProposalFormField("Info")
    );
  }

  for (let i = 0; i < 7; i++) {
    await expect(proposalSubmissionPage.addLinkBtn).toBeVisible();
    await proposalSubmissionPage.addLinkBtn.click();
  }

  await expect(proposalSubmissionPage.addLinkBtn).toBeHidden();
});

test("7G. Should accept valid data in treasury proposal", async ({ page }) => {
  test.slow();
  const proposalSubmissionPage = new ProposalSubmission(page);
  await proposalSubmissionPage.goto();
  await proposalSubmissionPage.treasuryRadioButton.click();
  await proposalSubmissionPage.continueBtn.click();

  for (let i = 0; i < 100; i++) {
    const prefix = environments.networkId == 0 ? "addr_test" : "addr";
    const randomBytes = new Uint8Array(10);
    const bech32Address = bech32.encode(prefix, randomBytes);
    await proposalSubmissionPage.validateForm(
      generateProposalFormField("Treasury", bech32Address)
    );
  }

  for (let i = 0; i < 7; i++) {
    await expect(proposalSubmissionPage.addLinkBtn).toBeVisible();
    await proposalSubmissionPage.addLinkBtn.click();
  }

  await expect(proposalSubmissionPage.addLinkBtn).toBeHidden();
});
