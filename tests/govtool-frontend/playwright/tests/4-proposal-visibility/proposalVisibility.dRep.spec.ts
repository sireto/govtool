import environments from "@constants/environments";
import { dRep01Wallet } from "@constants/staticWallets";
import { createTempDRepAuth } from "@datafactory/createAuth";
import { faker } from "@faker-js/faker";
import { test } from "@fixtures/walletExtension";
import { setAllureEpic } from "@helpers/allure";
import { lovelaceToAda } from "@helpers/cardano";
import { ShelleyWallet } from "@helpers/crypto";
import { createNewPageWithWallet } from "@helpers/page";
import {
  registerDRepForWallet,
  transferAdaForWallet,
  waitForTxConfirmation,
} from "@helpers/transaction";
import GovernanceActionsPage from "@pages/governanceActionsPage";
import { expect, Page } from "@playwright/test";
import { FilterOption, IProposal } from "@types";

test.describe("Logged in DRep", () => {
  test.use({ storageState: ".auth/dRep01.json", wallet: dRep01Wallet });

  test.beforeEach(async () => {
    await setAllureEpic("4. Proposal visibility");
  });

  test("4E. Should display DRep's voting power in governance actions page", async ({
    page,
  }) => {
    const votingPowerPromise = page.waitForResponse("**/get-voting-power/**");
    const governanceActionsPage = new GovernanceActionsPage(page);
    await governanceActionsPage.goto();

    const res = await votingPowerPromise;
    const votingPower = await res.json();

    await expect(
      page.getByText(`₳ ${lovelaceToAda(votingPower)}`)
    ).toBeVisible();
  });

  test("4F. Should Disable DRep functionality upon wallet disconnection on governance page", async ({
    page,
  }) => {
    const governanceActionsPage = new GovernanceActionsPage(page);
    await governanceActionsPage.goto();

    await page.getByTestId("disconnect-button").click();

    const govActionDetailsPage =
      await governanceActionsPage.viewFirstProposal();
    await expect(govActionDetailsPage.voteBtn).not.toBeVisible();
  });
});

test.describe("Temporary DReps", async () => {
  let dRepPage: Page;

  test.beforeEach(async ({ page, browser }, testInfo) => {
    await setAllureEpic("4. Proposal visibility");
    test.setTimeout(testInfo.timeout + 2 * environments.txTimeOut);

    const wallet = await ShelleyWallet.generate();
    await registerDRepForWallet(wallet);
    await transferAdaForWallet(wallet, 40);

    const tempDRepAuth = await createTempDRepAuth(page, wallet);

    dRepPage = await createNewPageWithWallet(browser, {
      storageState: tempDRepAuth,
      wallet,
      enableStakeSigning: true,
    });
  });

  test("4J. Should include metadata anchor in the vote transaction", async () => {
    const govActionsPage = new GovernanceActionsPage(dRepPage);
    await govActionsPage.goto();

    const govActionDetailsPage = await govActionsPage.viewFirstProposal();
    govActionDetailsPage.vote(faker.lorem.sentence(200));
    await waitForTxConfirmation(dRepPage);
    await govActionsPage.votedTab.click();
    await govActionsPage.viewFirstVotedProposal();
    expect(false, "No vote context displayed").toBe(true);
  });
});
