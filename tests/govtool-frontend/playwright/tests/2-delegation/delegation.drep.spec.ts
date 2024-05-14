import environments from "@constants/environments";
import { dRep01Wallet } from "@constants/staticWallets";
import { createTempDRepAuth } from "@datafactory/createAuth";
import { faker } from "@faker-js/faker";
import { test } from "@fixtures/walletExtension";
import { setAllureEpic } from "@helpers/allure";
import { ShelleyWallet } from "@helpers/crypto";
import { createNewPageWithWallet } from "@helpers/page";
import extractDRepFromWallet from "@helpers/shellyWallet";
import { pollTransaction, transferAdaForWallet } from "@helpers/transaction";
import DRepDirectoryPage from "@pages/dRepDirectoryPage";
import DRepRegistrationPage from "@pages/dRepRegistrationPage";
import { expect } from "@playwright/test";
import kuberService from "@services/kuberService";

test.beforeEach(async () => {
  await setAllureEpic("2. Delegation");
});

test.beforeEach(async () => {
  await setAllureEpic("2. Delegation");
});

test("2L. Should copy DRepId", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);

  const dRepDirectory = new DRepDirectoryPage(page);
  await dRepDirectory.goto();

  await dRepDirectory.searchInput.fill(dRep01Wallet.dRepId);
  await page.getByTestId(`${dRep01Wallet.dRepId}-copy-id-button`).click();
  await expect(page.getByText("Copied to clipboard")).toBeVisible();

  const copiedText = await page.evaluate(() => navigator.clipboard.readText());
  expect(copiedText).toEqual(dRep01Wallet.dRepId);
});

test("2N. Should show DRep information on details page", async ({
  page,
  browser,
}, testInfo) => {
  test.setTimeout(testInfo.timeout + 2 * environments.txTimeOut);

  const wallet = await ShelleyWallet.generate();

  await transferAdaForWallet(wallet, 600);

  const tempDRepAuth = await createTempDRepAuth(page, wallet);
  const dRepPage = await createNewPageWithWallet(browser, {
    storageState: tempDRepAuth,
    wallet,
    enableStakeSigning: true,
  });

  const dRepRegistrationPage = new DRepRegistrationPage(dRepPage);
  await dRepRegistrationPage.goto();

  const dRepId = extractDRepFromWallet(wallet);
  const name = faker.person.firstName();
  const email = faker.internet.email({ firstName: name });
  const bio = faker.person.bio();
  const links = [
    faker.internet.url({ appendSlash: true }),
    faker.internet.url(),
  ];

  await dRepRegistrationPage.register({
    name,
    email,
    bio,
    extraContentLinks: links,
  });

  await dRepRegistrationPage.confirmBtn.click();

  const dRepDirectory = new DRepDirectoryPage(dRepPage);
  await dRepDirectory.goto();

  await dRepDirectory.searchInput.fill(dRepId);
  await dRepPage.getByTestId(`${dRepId}-view-details-button`).click();

  // Verification
  await expect(dRepPage.getByTestId("copy-drep-id-button")).toHaveText(dRepId);
  await expect(dRepPage.getByText("Active", { exact: true })).toBeVisible();
  await expect(dRepPage.locator("dl").getByText("₳ 0")).toBeVisible();
  await expect(dRepPage.getByText(email, { exact: true })).toBeVisible();

  for (const link of links) {
    await expect(dRepPage.getByText(link, { exact: true })).toBeVisible();
  }
  await expect(dRepPage.getByText(bio, { exact: true })).toBeVisible();
});

test("2M. Should provide detailed dRep information on the dRep card.", async ({
  page,
  browser,
}) => {
  const wallet = await ShelleyWallet.generate();
  const res = await kuberService.transferADA(
    [wallet.addressBech32(environments.networkId)],
    600
  );
  await pollTransaction(res.txId, res.lockInfo);

  const tempDRepAuth = await createTempDRepAuth(page, wallet);
  const dRepPage = await createNewPageWithWallet(browser, {
    storageState: tempDRepAuth,
    wallet,
    enableStakeSigning: true,
  });

  const dRepRegistrationPage = new DRepRegistrationPage(dRepPage);
  await dRepRegistrationPage.goto();
  const fakerName = faker.person.firstName();
  const fakerEmail = faker.internet.email({ firstName: fakerName });
  const fakerBio = faker.person.bio();
  const fakerLinks = [
    faker.internet.url({ appendSlash: true }),
    faker.internet.url(),
  ];

  await dRepRegistrationPage.register({
    name: fakerName,
    email: fakerEmail,
    bio: fakerBio,
    extraContentLinks: fakerLinks,
  });
  const DRepId = extractDRepFromWallet(wallet);
  await expect(dRepRegistrationPage.registrationSuccessModal).toBeVisible();
  const dRepDirectory = new DRepDirectoryPage(page);
  await dRepDirectory.goto();

  await page.getByTestId("search-input").fill(DRepId);
  await page.getByTestId(`${DRepId}-view-details-button`).click();
  expect(
    (await page.getByTestId("copy-drep-id-button").textContent()).includes(
      DRepId
    )
  );
});

test("2M. Should provide detailed dRep information on the dRep card.", async ({
  page,
  browser,
}) => {
  const wallet = await ShelleyWallet.generate();
  const res = await kuberService.transferADA(
    [wallet.addressBech32(environments.networkId)],
    600
  );
  await pollTransaction(res.txId, res.lockInfo);

  const tempDRepAuth = await createTempDRepAuth(page, wallet);
  const dRepPage = await createNewPageWithWallet(browser, {
    storageState: tempDRepAuth,
    wallet,
    enableStakeSigning: true,
  });

  const dRepRegistrationPage = new DRepRegistrationPage(dRepPage);
  await dRepRegistrationPage.goto();
  const fakerName = faker.person.firstName();
  const fakerEmail = faker.internet.email({ firstName: fakerName });
  const fakerBio = faker.person.bio();
  const fakerLinks = [
    faker.internet.url({ appendSlash: true }),
    faker.internet.url(),
  ];

  await dRepRegistrationPage.register({
    name: fakerName,
    email: fakerEmail,
    bio: fakerBio,
    extraContentLinks: fakerLinks,
  });
  const DRepId = extractDRepFromWallet(wallet);
  await expect(dRepRegistrationPage.registrationSuccessModal).toBeVisible();
  const dRepDirectory = new DRepDirectoryPage(page);
  await dRepDirectory.goto();

  await page.getByTestId("search-input").fill(DRepId);
  await page.getByTestId(`${DRepId}-view-details-button`).click();
  expect(
    (await page.getByTestId("copy-drep-id-button").textContent()).includes(
      DRepId
    )
  );
});
