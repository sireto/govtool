import { downloadMetadata } from "@helpers/metadata";
import { Download, Page } from "@playwright/test";
import metadataBucketService from "@services/metadataBucketService";
import { IGovernanceProposal } from "@types";
import environments from "lib/constants/environments";
import { withTxConfirmation } from "lib/transaction.decorator";

export default class ProposalSubmission {
  readonly registerBtn = this.page.getByTestId("register-button");
  readonly skipBtn = this.page.getByTestId("skip-button");
  readonly confirmBtn = this.page.getByTestId("confirm-modal-button");
  readonly registrationSuccessModal = this.page.getByTestId(
    "create-governance-action-submitted-modal"
  );

  readonly continueBtn = this.page.getByTestId("continue-button");
  readonly addLinkBtn = this.page.getByRole("button", { name: "+ Add link" }); // BUG testid= add-link-button

  readonly infoRadioButton = this.page.getByTestId("Info-radio");
  readonly treasuryRadioButton = this.page.getByTestId("Treasury-radio");

  // input fields
  readonly titleInput = this.page.getByPlaceholder("A name for this Action"); // BUG testid = title-input
  readonly abstractInput = this.page.getByPlaceholder("Summary"); // BUG testid = abstract-input

  readonly motivationInput = this.page.getByPlaceholder(
    "Problem this GA will solve"
  ); // BUG testid = motivation-input
  readonly rationaleInput = this.page.getByPlaceholder(
    "Content of Governance Action"
  ); // BUG testid = rationale-input
  readonly linkInput = this.page.getByPlaceholder("https://website.com/"); // BUG testid = link-input
  readonly receivingAddressInput = this.page.getByPlaceholder(
    "The address to receive funds"
  );
  readonly amountInput = this.page.getByPlaceholder("e.g.");

  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto(
      `${environments.frontendUrl}/create_governance_action`
    );
    await this.continueBtn.click();
  }
  @withTxConfirmation
  async register(governanceProposal: IGovernanceProposal) {
    await this.fillupForm(governanceProposal);
    await this.continueBtn.click();
    await this.continueBtn.click();
    await this.page.getByRole("checkbox").click();
    await this.continueBtn.click();
    this.page
      .getByRole("button", { name: `${governanceProposal.type}.jsonld` })
      .click(); // BUG test id = metadata-download-button
    const dRepMetadata = await this.downloadVoteMetadata();
    const url = await metadataBucketService.uploadMetadata(
      dRepMetadata.name,
      dRepMetadata.data
    );
    await this.page.getByPlaceholder("URL").fill(url);
    await this.continueBtn.click();
  }

  async downloadVoteMetadata() {
    const download: Download = await this.page.waitForEvent("download");
    return downloadMetadata(download);
  }

  async fillupForm(governanceProposal: IGovernanceProposal) {
    await this.titleInput.fill(governanceProposal.title);
    await this.abstractInput.fill(governanceProposal.abstract);
    await this.motivationInput.fill(governanceProposal.motivation);
    await this.rationaleInput.fill(governanceProposal.rationale);
    if (governanceProposal.type === "Treasury") {
      await this.receivingAddressInput.fill(
        governanceProposal.receivingAddress
      );
      await this.amountInput.fill(governanceProposal.amount);
    }
    if (governanceProposal.extraContentLinks != null) {
      for (let i = 0; i < governanceProposal.extraContentLinks.length; i++) {
        if (i > 0) {
          this.page
            .getByRole("button", {
              name: "+ Add link",
            })
            .click();
        }
        await this.linkInput
          .nth(i)
          .fill(governanceProposal.extraContentLinks[i]);
      }
    }
  }
}
