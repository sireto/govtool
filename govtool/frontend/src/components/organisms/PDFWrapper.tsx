import React, { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import "@intersect.mbo/pdf-ui/style";
import { useCardano, useGovernanceActions } from "@/context";

const PDF = React.lazy(() => import("@intersect.mbo/pdf-ui/cjs"));

export const PDFWrapper = () => {
  const { walletApi, ...context } = useCardano();
  const { createGovernanceActionJsonLD, createHash } = useGovernanceActions();

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 5 },
        py: 3,
        display: "flex",
        flex: 1,
      }}
    >
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              flex: 1,
              height: "100vw",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <PDF
          walletAPI={{
            ...context,
            ...walletApi,
            createGovernanceActionJsonLD,
            createHash,
          }}
          pathname={window.location.pathname}
        />
      </Suspense>
    </Box>
  );
};
