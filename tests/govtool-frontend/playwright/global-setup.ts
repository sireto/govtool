import { faucetWallet } from "@constants/staticWallets";
import { ShelleyWallet } from "@helpers/crypto";
import { pollTransaction } from "@helpers/transaction";
import { loadAmountFromFaucet } from "@services/faucetService";
import kuberService from "@services/kuberService";
import walletManager from "lib/walletManager";

async function generateWallets(num: number) {
  return await Promise.all(
    Array.from({ length: num }, () =>
      ShelleyWallet.generate().then((wallet) => wallet.json())
    )
  );
}

async function globalSetup() {
  const registeredDRepWallets = await generateWallets(9);
  const registerDRepWallets = await generateWallets(9);
  const proposalSubmissionWallets = await generateWallets(1);
  const adaHolderWallets = await generateWallets(2);

  // faucet setup
  const res = await loadAmountFromFaucet(faucetWallet.address);
  await pollTransaction(res.txid);

  // initialize wallets
  const initializeRes = await kuberService.initializeWallets([
    ...registeredDRepWallets,
    ...registerDRepWallets,
    ...proposalSubmissionWallets,
    ...adaHolderWallets,
  ]);
  await pollTransaction(initializeRes.txId, initializeRes.lockInfo);

  // register dRep
  const registrationRes = await kuberService.multipleDRepRegistration(
    registeredDRepWallets
  );
  await pollTransaction(registrationRes.txId, registrationRes.lockInfo);

  // transfer 600 ADA for dRep registration
  const dRepAmountOutputs = registerDRepWallets.map((wallet) => {
    return { address: wallet.address, value: `${600}A` };
  });
  const proposalAmountOutput = proposalSubmissionWallets.map((wallet) => {
    return { address: wallet.address, value: `${51_000}A` };
  });
  const transferRes = await kuberService.multipleTransferADA([
    ...dRepAmountOutputs,
    ...proposalAmountOutput,
  ]);
  await pollTransaction(transferRes.txId, transferRes.lockInfo);

  // save to file
  await walletManager.writeWallets(registeredDRepWallets, "registeredDRep");
  await walletManager.writeWallets(registerDRepWallets, "registerDRep");
  await walletManager.writeWallets(
    proposalSubmissionWallets,
    "proposalSubmission"
  );
  await walletManager.writeWallets(adaHolderWallets, "adaHolder");
}

export default globalSetup;
