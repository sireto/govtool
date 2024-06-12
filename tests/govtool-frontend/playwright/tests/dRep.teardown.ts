import environments from "@constants/environments";
import { setAllureEpic, setAllureStory } from "@helpers/allure";
import { pollTransaction } from "@helpers/transaction";
import { test as cleanup, expect } from "@playwright/test";
import kuberService from "@services/kuberService";
import { StaticWallet } from "@types";

const registeredDRepWallets: StaticWallet[] = require("../_mock/registeredDRepCopy.json");
const registerDRepWallets: StaticWallet[] = require("../_mock/registerDRepCopy.json");

cleanup.describe.configure({ timeout: environments.txTimeOut });
cleanup.beforeEach(async () => {
  await setAllureEpic("Setup");
  await setAllureStory("Cleanup");
});

cleanup("DRep de-registration", async () => {
  registerDRepWallets.map(async (wallet) => {
    try {
      const { txId, lockInfo } = await kuberService.dRepDeRegistration(
        wallet.address,
        wallet.payment.private,
        wallet.stake.private,
        wallet.stake.pkh
      );
      await pollTransaction(txId, lockInfo);
    } catch (err) {
      if (err.status === 400) {
        expect(true, "Stake not registered").toBeTruthy();
      } else {
        throw Error(err);
      }
    }
  });
});
