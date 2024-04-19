import { CIP30Instance, Cip95Instance } from "@cardano-test-wallet";
import { Page } from "@playwright/test";

export default class LoginPage {
  readonly connectWalletBtn = this.page.getByTestId("connect-wallet-button");
  readonly demosWalletBtn = this.page.getByTestId("demos-wallet-button").nth(1);
  readonly acceptSanchoNetInfoBtn = this.page
    .getByTestId("confirm-modal-button")
    .nth(0);
  readonly disconnectWalletBtn = this.page.getByTestId("disconnect-button");

  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  async login() {
    await this.goto();

    await this.connectWalletBtn.click();
    await this.demosWalletBtn.click({ force: true });
    await this.acceptSanchoNetInfoBtn.click({ force: true });

    await this.page.evaluate(async () => {
      const wallet: CIP30Instance | Cip95Instance = await window["cardano"][
        "demos"
      ].enable();
    });
  }

  async logout() {
    await this.disconnectWalletBtn.click();
  }
}
