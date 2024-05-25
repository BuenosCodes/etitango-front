import React, { useContext } from 'react';
import { EtiEventContext } from '../../helpers/EtiEventContext';
import { useTranslation } from 'react-i18next';
import { SCOPES } from '../../helpers/constants/i18n';
import { Grid, Typography } from '@mui/material';
import { Signup, SignupStatus } from '../../shared/signup';
import ReceiptUpload from '../../components/receiptUpload/index';

import { ResetSignup } from '../inscripcion/ResetSignup';

export function SignupStatusDisplay({ signupDetails }: { signupDetails: Signup }) {
  const { etiEvent } = useContext(EtiEventContext);
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP], {
    useSuspense: false
  });

  if (!signupDetails || !etiEvent?.id) return <></>;
  return (
    <Grid item style={{ textAlign: 'center' }}>
      <Typography variant="h6">{t(`${SCOPES.MODULES.SIGN_UP}.alreadySignedUpReason`)}</Typography>
      {signupDetails?.status === SignupStatus.CANCELLED ? (
        <ResetSignup etiEventId={etiEvent.id} signupId={signupDetails.id} />
      ) : (
        <ReceiptUpload signupDetails={signupDetails} />
      )}
    </Grid>
  );
}
