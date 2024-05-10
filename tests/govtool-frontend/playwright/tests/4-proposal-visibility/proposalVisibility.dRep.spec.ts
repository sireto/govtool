import { dRep01Wallet } from "@constants/staticWallets";
import { test } from "@fixtures/walletExtension";
import GovernanceActionsPage from "@pages/governanceActionsPage";
import { expect } from "@playwright/test";

test.use({ storageState: ".auth/dRep01.json", wallet: dRep01Wallet });

test("4E. Should display DRep's voting power in governance actions page", async ({
  page,
}) => {
  const votingPowerPromise = page.waitForResponse("**/get-voting-power/**");
  const governanceActionsPage = new GovernanceActionsPage(page);
  await governanceActionsPage.goto();

  const res = await votingPowerPromise;
  const votingPowerLovelace = await res.json();
  const votingPowerAda = votingPowerLovelace / 1000000;

  await expect(page.getByText(`₳ ${votingPowerAda}`)).toBeVisible();
});

test("4F. Should Disable DRep functionality upon wallet disconnection on governance page", async ({
  page,
}) => {
  const governanceActionsPage = new GovernanceActionsPage(page);
  await governanceActionsPage.goto();

  await page.getByTestId("disconnect-button").click();

  const govActionDetailsPage = await governanceActionsPage.viewFirstProposal();
  await expect(govActionDetailsPage.voteBtn).not.toBeVisible();
});
