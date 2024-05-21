import environments from "@constants/environments";
import { user01Wallet } from "@constants/staticWallets";
import { test } from "@fixtures/walletExtension";
import { setAllureEpic } from "@helpers/allure";
import {
  generateInValidProposalFormField,
  generateValidProposalFormField,
} from "@helpers/proposalSubmission";
import ProposalSubmission from "@pages/proposalSubmissionPage";
import { expect } from "@playwright/test";
import { ProposalType } from "@types";
import { bech32 } from "bech32";

test.use({ storageState: ".auth/user01.json", wallet: user01Wallet });

test.beforeEach(async () => {
  await setAllureEpic("7. Proposal submission");
});

test.describe("Should accept valid data in Proposal form", () => {
  const type: Array<ProposalType> = ["Info", "Treasury"];
  const buttons = ["infoRadioButton", "treasuryRadioButton"];

  for (let j = 0; j < type.length; j++) {
    test(`7E.${j + 1} Should accept valid data in ${type[j].toLowerCase()} proposal form`, async ({
      page,
    }) => {
      test.slow();
      const proposalSubmissionPage = new ProposalSubmission(page);
      await proposalSubmissionPage.goto();
      await proposalSubmissionPage[buttons[j]].click();
      await proposalSubmissionPage.continueBtn.click();

      for (let i = 0; i < 100; i++) {
        const prefix = environments.networkId == 0 ? "addr_test" : "addr";
        const randomBytes = new Uint8Array(10);
        const bech32Address = bech32.encode(prefix, randomBytes);
        await proposalSubmissionPage.validateForm(
          generateValidProposalFormField(type[j], bech32Address)
        );
      }

      for (let i = 0; i < 7; i++) {
        await expect(proposalSubmissionPage.addLinkBtn).toBeVisible();
        await proposalSubmissionPage.addLinkBtn.click();
      }

      await expect(proposalSubmissionPage.addLinkBtn).toBeHidden();
    });
  }
});

test.describe("Should reject invalid data in Proposal form", () => {
  const type: Array<ProposalType> = ["Info", "Treasury"];
  const buttons = ["infoRadioButton", "treasuryRadioButton"];

  for (let j = 0; j < type.length; j++) {
    test(`7F.${j + 1} Should reject invalid data in ${type[j].toLowerCase()} Proposal form`, async ({
      page,
    }) => {
      test.slow();
      const proposalSubmissionPage = new ProposalSubmission(page);
      await proposalSubmissionPage.goto();
      await proposalSubmissionPage[buttons[j]].click();
      await proposalSubmissionPage.continueBtn.click();

      for (let i = 0; i < 100; i++) {
        await proposalSubmissionPage.inValidateForm(
          generateInValidProposalFormField(type[j])
        );
      }
    });
  }
});
