import { faucetWallet } from "@constants/staticWallets";
import { setAllureSuitsAndFeature } from "@helpers/allure";
import { pollTransaction } from "@helpers/transaction";
import { test as setup } from "@playwright/test";
import { loadAmountFromFaucet } from "@services/faucetService";
import kuberService from "@services/kuberService";
import environments from "lib/constants/environments";

setup.describe.configure({ mode: "serial", timeout: environments.txTimeOut });

setup.beforeEach(async () => {
  await setAllureSuitsAndFeature("Setup");
});

setup("Fund faucet wallet", async () => {
  const balance = await kuberService.getBalance(faucetWallet.address);
  if (balance > 2000) return;

  const res = await loadAmountFromFaucet(faucetWallet.address);
  await pollTransaction(res.txid);
});
