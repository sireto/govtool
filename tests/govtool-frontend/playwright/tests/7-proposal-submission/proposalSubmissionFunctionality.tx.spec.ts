import environments from "@constants/environments";
import { createTempUserAuth } from "@datafactory/createAuth";
import { test } from "@fixtures/walletExtension";
import { setAllureEpic } from "@helpers/allure";
import { ShelleyWallet } from "@helpers/crypto";
import {
  submitInfoProposal,
  submitTreasuryProposal,
} from "@helpers/proposalSubmission";
import { createNewPageWithWallet } from "@helpers/page";
import { transferAdaForWallet } from "@helpers/transaction";
import ProposalSubmission from "@pages/proposalSubmissionPage";
import { expect } from "@playwright/test";

test.describe("Should create proper proposal submission request, when registered with data", () => {
  let globalProposalSubmissionPage: ProposalSubmission;
  let wallet: ShelleyWallet;

  test.beforeEach(async ({ browser, page }, testInfo) => {
    await setAllureEpic("7. Proposal submission");
    test.setTimeout(testInfo.timeout + environments.txTimeOut);
    wallet = await ShelleyWallet.generate();
    await transferAdaForWallet(wallet, 100000);
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

  test("7G.1: Should create info proposal", async ({}) => {
    await submitInfoProposal(globalProposalSubmissionPage, "Info");
  });

  test("7G.2: Should create treasury proposal", async ({}) => {
    await submitTreasuryProposal(
      globalProposalSubmissionPage,
      "Treasury",
      wallet
    );
  });
});
