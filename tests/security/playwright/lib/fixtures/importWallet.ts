import { Page } from "@playwright/test";
import { CardanoTestWallet } from "@cardano-test-wallet";

export async function importWallet(page: Page, wallet: CardanoTestWallet) {
  await page.addInitScript((wallet) => {
    // @ts-ignore
    window.cardanoTestWallet.wallet = wallet;
  }, wallet);
}
