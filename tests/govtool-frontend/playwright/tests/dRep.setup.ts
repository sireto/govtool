import environments from "@constants/environments";
import { dRepWallets } from "@constants/staticWallets";
import { pollTransaction } from "@helpers/transaction";
import { expect, test as setup } from "@playwright/test";
import kuberService from "@services/kuberService";
import { Logger } from "../../cypress/lib/logger/logger";
import fetch = require("node-fetch");
import { setAllureStory, setAllureEpic } from "@helpers/allure";

const dRepInfo = require("../lib/_mock/dRepInfo.json");

setup.describe.configure({ timeout: environments.txTimeOut });

setup.beforeEach(async () => {
  await setAllureEpic("Setup");
  await setAllureStory("DRep");
});
dRepWallets.forEach((wallet) => {
  setup(`Register DRep of wallet: ${wallet.address}`, async () => {
    try {
      const res = await kuberService.dRepRegistration(
        wallet.stake.private,
        wallet.stake.pkh
      );

      await pollTransaction(res.txId, res.lockInfo);
    } catch (err) {
      if (err.status === 400) {
        expect(true, "DRep already registered").toBeTruthy();
      } else {
        throw err;
      }
    }
  });
});

setup("Setup dRep metadata", async () => {
  try {
    const res = await fetch(`${environments.metadataBucketUrl}/Test_dRep`, {
      method: "PUT",
      body: JSON.stringify(dRepInfo),
    });
    Logger.success("Uploaded dRep metadata to bucket");
  } catch (err) {
    Logger.fail(`Failed to upload dRep metadata: ${err}`);
    throw err;
  }
});
