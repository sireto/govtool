import { faker } from "@faker-js/faker";
import { generateWalletAddress } from "@helpers/cardano";
import removeAllSpaces from "@helpers/removeAllSpaces";
import { extractProposalIdFromUrl } from "@helpers/string";
import { Page, expect } from "@playwright/test";
import { ProposalCreateRequest } from "@services/proposalDiscussion/types";
import environments from "lib/constants/environments";
import ProposalDiscussionDetailsPage from "./proposalDiscussionDetailsPage";

export default class ProposalDiscussionPage {
  // Buttons
  readonly proposalCreateBtn = this.page.getByTestId(
    "propose-a-governance-action-button"
  );
  readonly continueBtn = this.page.getByRole("button", { name: "Continue" }); // #BUG test-id missing
  readonly filterBtn = this.page.getByTestId("filter-button"); // this.page.getByTestId("filters-button");
  readonly shareBtn = this.page
    .locator('[data-testid$="-share-button"]')
    .first();
  readonly sortBtn = this.page.getByTestId("sort-button");
  readonly searchInput = this.page.getByPlaceholder("Search..."); // this.page.getByTestId("search-input");
  readonly showAllBtn = this.page.getByTestId("show-all-button").first(); //this.page.getByTestId("show-all-button");
  readonly showLessBtn = this.page.getByRole("button", { name: "Show less" });
  readonly infoRadio = this.page.getByTestId("Info-radio-wrapper");
  readonly treasuryRadio = this.page.getByTestId("Treasury-radio-wrapper");

  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto(
      `${environments.frontendUrl}/connected/proposal_pillar/proposal_discussion`
    );
    await this.page.waitForTimeout(2_000);
  }

  async closeUsernamePrompt() {
    await this.page.waitForTimeout(5_000);
    await this.page
      .locator("div")
      .filter({ hasText: /^Hey, setup your username$/ })
      .getByRole("button")
      .click();
  }

  async viewFirstProposal(): Promise<ProposalDiscussionDetailsPage> {
    await this.page.locator('[data-testid$="-view-details"]').first().click();
    return new ProposalDiscussionDetailsPage(this.page);
  }

  async getAllProposals() {
    await this.page.waitForTimeout(2_000);
    const elements = this.page.locator('[data-testid^="proposal"]');
    const dataTestIds = await elements.evaluateAll((elements) =>
      elements
        .filter((element) => {
          const dataTestId = element.getAttribute("data-testid");
          return /^proposal.*\d$/.test(dataTestId);
        })
        .map((element) => element.getAttribute("data-testid"))
    );

    return dataTestIds.map((dataTestId) =>
      this.page.locator(`*[data-testid="${dataTestId}"]`)
    );

    // BUG should be -card on end of test id
  }

  async setUsername(name: string) {
    await this.page.getByLabel("Username *").fill(name);

    const proceedBtn = this.page.getByRole("button", {
      name: "Proceed with this username",
    });
    await proceedBtn.click();
    await proceedBtn.click();

    await this.page.getByRole("button", { name: "Close" }).click();
  }

  async createProposal(): Promise<number> {
    const receivingAddr = generateWalletAddress();
    const proposalRequest: ProposalCreateRequest = {
      proposal_links: [
        {
          prop_link: faker.internet.url(),
          prop_link_text: faker.internet.displayName(),
        },
      ],
      gov_action_type_id: 1,
      prop_name: faker.company.name(),
      prop_abstract: faker.lorem.paragraph(2),
      prop_motivation: faker.lorem.paragraph(2),
      prop_rationale: faker.lorem.paragraph(2),
      prop_receiving_address: receivingAddr,
      prop_amount: faker.number.int({ min: 100, max: 1000 }).toString(),
      is_draft: false,
    };

    await this.proposalCreateBtn.click();
    await this.continueBtn.click();

    await this.fillForm(proposalRequest);
    await this.continueBtn.click();
    await this.page.getByRole("button", { name: "Submit" }).click();

    // Wait for redirection to `proposal-discussion-details` page
    await this.page.waitForTimeout(2_000);

    const currentPageUrl = this.page.url();
    return extractProposalIdFromUrl(currentPageUrl);
  }

  private async fillForm(data: ProposalCreateRequest) {
    await this.page.getByLabel("Governance Action Type *").click();
    await this.page.getByRole("option", { name: "Info" }).click();
    await this.page.getByLabel("Title *").fill(data.prop_name);
    await this.page.getByPlaceholder("Summary...").fill(data.prop_abstract);
    await this.page.getByLabel("Motivation *").fill(data.prop_motivation);
    await this.page.getByLabel("Rationale *").fill(data.prop_rationale);
    await this.page
      .getByLabel("Receiving address *")
      .fill(data.prop_receiving_address);

    await this.page.getByPlaceholder("e.g.").fill(data.prop_amount);
  }
}
