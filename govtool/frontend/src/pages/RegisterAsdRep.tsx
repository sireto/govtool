import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { Box } from "@mui/material";

import { Background } from "@atoms";
import { PATHS } from "@consts";
import { useModal } from "@context";
import {
  useScreenDimension,
  useTranslation,
  defaultRegisterAsDRepValues,
} from "@hooks";
import { LinkWithIcon } from "@molecules";
import {
  DashboardTopNav,
  Footer,
  RolesAndResponsibilities,
  RegisterAsdRepStepThree,
  RegisterAsDRepForm,
} from "@organisms";
import { checkIsWalletConnected } from "@utils";

export const RegisterAsdRep = () => {
  const [step, setStep] = useState<number>(1);
  const { isMobile } = useScreenDimension();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { closeModal, openModal } = useModal();

  const methods = useForm({
    mode: "onChange",
    defaultValues: defaultRegisterAsDRepValues,
  });

  useEffect(() => {
    if (checkIsWalletConnected()) {
      navigate(PATHS.home);
    }
  }, []);

  const onClickBackToDashboard = () => openModal({
    type: "statusModal",
    state: {
      status: "warning",
      message: t("modals.registration.cancelDescription"),
      buttonText: t("modals.common.goToDashboard"),
      title: t("modals.registration.cancelTitle"),
      dataTestId: "cancel-registration-modal",
      onSubmit: backToDashboard,
    },
  });

  const backToDashboard = () => {
    navigate(PATHS.dashboard);
    closeModal();
  };

  return (
    <Background isReverted>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <DashboardTopNav title={t("registration.becomeADRep")} />
        <LinkWithIcon
          label={t("backToDashboard")}
          onClick={onClickBackToDashboard}
          sx={{
            mb: isMobile ? 0 : 1.5,
            ml: isMobile ? 2 : 5,
            mt: isMobile ? 3 : 1.5,
          }}
        />
        {step === 1 && (
          <RolesAndResponsibilities
            onClickCancel={onClickBackToDashboard}
            setStep={setStep}
          />
        )}
        <FormProvider {...methods}>
          {step === 2 && <RegisterAsDRepForm setStep={setStep} />}
          {step === 3 && <RegisterAsdRepStepThree setStep={setStep} />}
        </FormProvider>
        {isMobile && <Footer />}
      </Box>
    </Background>
  );
};
