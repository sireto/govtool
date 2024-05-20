import environments from "@constants/environments";
import { createTempUserAuth } from "@datafactory/createAuth";
import { test } from "@fixtures/walletExtension";
import { setAllureEpic } from "@helpers/allure";
import { ShelleyWallet } from "@helpers/crypto";
import {
  submitInfoProposal,
  submitTreasuryProposal,
} from "@helpers/governanceAction";
import { createNewPageWithWallet } from "@helpers/page";
import { transferAdaForWallet } from "@helpers/transaction";
import ProposalSubmission from "@pages/proposalSubmissionPage";
import { expect } from "@playwright/test";

test.describe("Should create a governance action purposal", () => {
  let globalProposalSubmissionPage: ProposalSubmission;
  let wallet: ShelleyWallet;

  test.beforeEach(async ({ browser, page }, testInfo) => {
    await setAllureEpic("7. Proposal submission");
    test.setTimeout(testInfo.timeout + environments.txTimeOut);
    wallet = await ShelleyWallet.generate();
    transferAdaForWallet(wallet, 1000);
    const tempUserAuth = await createTempUserAuth(page, wallet);
    const governancePage = await createNewPageWithWallet(browser, {
      storageState: tempUserAuth,
      wallet,
      enableStakeSigning: true,
    });

    const proposalSubmissionPage = new ProposalSubmission(governancePage);
    await proposalSubmissionPage.goto();
    await expect(proposalSubmissionPage.continueBtn).toBeDisabled();

    globalProposalSubmissionPage = proposalSubmissionPage;
  });

  test("7H. Should create a governance action info purpose", async ({}) => {
    await submitInfoProposal(globalProposalSubmissionPage, "Info");
  });

  test("7I. Should create a governance action treasury purpose", async ({}) => {
    await submitTreasuryProposal(
      globalProposalSubmissionPage,
      "Treasury",
      wallet
    );
  });
});
