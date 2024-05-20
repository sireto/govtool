import { user01Wallet } from "@constants/staticWallets";
import { test } from "@fixtures/walletExtension";
import { setAllureEpic } from "@helpers/allure";
import ProposalSubmission from "@pages/proposalSubmissionPage";
import { expect } from "@playwright/test";

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

test("7C. Should show governance action type", async ({ page }) => {
  const proposalSubmissionPage = new ProposalSubmission(page);
  await proposalSubmissionPage.goto();
  await expect(proposalSubmissionPage.infoRadioButton).toBeVisible();
  await expect(proposalSubmissionPage.treasuryRadioButton).toBeVisible();
});

test("7D.Verify Governance action Purpose info type with Wallet Connected State State", async ({
  page,
}) => {
  const proposalSubmissionPage = new ProposalSubmission(page);
  await proposalSubmissionPage.goto();

  await proposalSubmissionPage.infoRadioButton.click();
  await proposalSubmissionPage.continueBtn.click();

  await expect(proposalSubmissionPage.titleInput).toBeVisible();
  await expect(proposalSubmissionPage.abstractInput).toBeVisible();
  await expect(proposalSubmissionPage.motivationInput).toBeVisible();
  await expect(proposalSubmissionPage.rationaleInput).toBeVisible();
  await expect(proposalSubmissionPage.addLinkBtn).toBeVisible();
});

test("7E.Verify Governance action Purpose treasury type with Wallet Connected State State", async ({
  page,
}) => {
  const proposalSubmissionPage = new ProposalSubmission(page);
  await proposalSubmissionPage.goto();

  await proposalSubmissionPage.treasuryRadioButton.click();
  await proposalSubmissionPage.continueBtn.click();

  await expect(proposalSubmissionPage.titleInput).toBeVisible();
  await expect(proposalSubmissionPage.abstractInput).toBeVisible();
  await expect(proposalSubmissionPage.motivationInput).toBeVisible();
  await expect(proposalSubmissionPage.rationaleInput).toBeVisible();
  await expect(proposalSubmissionPage.addLinkBtn).toBeVisible();
  await expect(proposalSubmissionPage.receivingAddressInput).toBeVisible();
  await expect(proposalSubmissionPage.amountInput).toBeVisible();
});
