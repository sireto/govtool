import { test as base, expect } from "@playwright/test";
import loadDemosExtension from "./loadDemosExtension";
import { importWallet } from "./importWallet";
import { userWallet } from "@lib/constants/wallets";

export const test = base.extend({
  page: async ({ page }, use) => {
    await loadDemosExtension(page);
    await importWallet(page, userWallet);

    await use(page);
  },
});
