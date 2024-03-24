import { FC } from "react";
import { Box } from "@mui/material";

import { Button } from "@atoms";
import {
  GovernanceActionCardElement,
  GovernanceActionCardHeader,
  GovernanceActionCardStatePill,
  GovernanceActionsDatesBox,
} from "@molecules";

import { useScreenDimension, useTranslation } from "@hooks";
import {
  formatDisplayDate,
  getFullGovActionId,
  getProposalTypeLabel,
  getProposalTypeNoEmptySpaces,
} from "@utils";

const mockedLongText =
  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit, distinctio culpa minus eaque illo quidem voluptates quisquam mollitia consequuntur ex, sequi saepe? Ad ex adipisci molestiae sed.";

interface ActionTypeProps
  extends Omit<
    ActionType,
    | "yesVotes"
    | "noVotes"
    | "abstainVotes"
    | "metadataHash"
    | "url"
    | "details"
    | "id"
    | "txHash"
    | "index"
  > {
  txHash: string;
  index: number;
  isDataMissing: boolean;
  onClick?: () => void;
  inProgress?: boolean;
}

export const GovernanceActionCard: FC<ActionTypeProps> = ({ ...props }) => {
  const {
    type,
    inProgress = false,
    expiryDate,
    onClick,
    createdDate,
    txHash,
    index,
    isDataMissing,
  } = props;
  const { isMobile, screenWidth } = useScreenDimension();
  const { t } = useTranslation();

  const govActionId = getFullGovActionId(txHash, index);

  return (
    <Box
      sx={{
        width: screenWidth < 420 ? 290 : isMobile ? 324 : 350,
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0px 4px 15px 0px #DDE3F5",
        borderRadius: "20px",
        backgroundColor: isDataMissing
          ? "rgba(251, 235, 235, 0.50)"
          : "rgba(255, 255, 255, 0.3)",
        ...(isDataMissing && {
          border: "1px solid #F6D5D5",
        }),
        ...(inProgress && {
          border: "1px solid #FFCBAD",
        }),
      }}
      data-testid={`govaction-${getProposalTypeNoEmptySpaces(type)}-card`}
    >
      {inProgress && <GovernanceActionCardStatePill variant="inProgress" />}
      <Box
        sx={{
          padding: "40px 24px 0",
        }}
      >
        <GovernanceActionCardHeader
          // TODO: Add real title from props when BE is ready
          title="Fund our project"
          isDataMissing={isDataMissing}
        />
        <GovernanceActionCardElement
          label={t("govActions.abstract")}
          text={mockedLongText}
          textVariant="twoLines"
          dataTestId="governance-action-abstract"
          isSliderCard
        />
        <GovernanceActionCardElement
          label={t("govActions.governanceActionType")}
          text={getProposalTypeLabel(type)}
          textVariant="pill"
          dataTestId={`${getProposalTypeNoEmptySpaces(type)}-type`}
          isSliderCard
        />
        <GovernanceActionsDatesBox
          createdDate={formatDisplayDate(createdDate)}
          expiryDate={formatDisplayDate(expiryDate)}
          isSliderCard
        />
        <GovernanceActionCardElement
          label={t("govActions.governanceActionId")}
          text={getFullGovActionId(txHash, index)}
          dataTestId={`${getFullGovActionId(txHash, index)}-id`}
          isCopyButton
          isSliderCard
        />
      </Box>
      <Box
        sx={{
          boxShadow: "0px 4px 15px 0px #DDE3F5",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          padding: 3,
          bgcolor: "white",
        }}
      >
        <Button
          onClick={onClick}
          variant={inProgress ? "outlined" : "contained"}
          size="large"
          sx={{
            width: "100%",
          }}
          data-testid={`govaction-${govActionId}-view-detail`}
        >
          {t("govActions.viewDetails")}
        </Button>
      </Box>
    </Box>
  );
};
