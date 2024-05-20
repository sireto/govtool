import { Page } from "@playwright/test";
import environments from "lib/constants/environments";

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
}
