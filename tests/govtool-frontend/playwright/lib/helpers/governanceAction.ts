import environments from "@constants/environments";
import { faker } from "@faker-js/faker";
import ProposalSubmission from "@pages/proposalSubmissionPage";
import { IGovernanceProposal, ProposalType } from "@types";
import { ShelleyWallet } from "./crypto";

export function generateProposalFormField(
  proposalType: ProposalType,
  receivingAddress?: string
) {
  const proposal: IGovernanceProposal = {
    title: faker.lorem.sentence(6),
    abstract: faker.lorem.paragraph(2),
    motivation: faker.lorem.paragraphs(2),
    rationale: faker.lorem.paragraphs(2),

    extraContentLinks: [faker.internet.url()],
    type: proposalType,
  };
  if (proposalType === "Treasury") {
    (proposal.receivingAddress = receivingAddress),
      (proposal.amount = faker.number.int({ min: 100, max: 1000 }).toString());
  }
  return proposal;
}

export async function submitInfoProposal(
  proposalSubmissionPage: ProposalSubmission,
  proposalType: ProposalType
) {
  await proposalSubmissionPage.infoRadioButton.click();
  await proposalSubmissionPage.continueBtn.click();

  const infoProposal: IGovernanceProposal =
    generateProposalFormField(proposalType);
  await proposalSubmissionPage.register({ ...infoProposal });
}

export async function submitTreasuryProposal(
  proposalSubmissionPage: ProposalSubmission,
  proposalType: ProposalType,
  wallet: ShelleyWallet
) {
  await proposalSubmissionPage.treasuryRadioButton.click();
  await proposalSubmissionPage.continueBtn.click();

  const treasuryProposal: IGovernanceProposal = generateProposalFormField(
    proposalType,
    wallet.rewardAddressBech32(environments.networkId)
  );

  await proposalSubmissionPage.register({ ...treasuryProposal });
}
