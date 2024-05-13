import { uploadEventReceipt } from '../../helpers/firestore/signups';
import { SCOPES } from '../../helpers/constants/i18n';
import { Container, Grid, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SignupStatus } from '../../shared/signup';
import { ReceiptDisplay } from '../ReceiptDisplay';
import FileUpload from '../FileUpload';

/* eslint-disable react/prop-types */
function ReceiptUpload({ signUpDetails, setSignUpDetails }) {
  const { id: signUpId, userId, etiEventId } = signUpDetails;
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP], {
    useSuspense: false
  });

  const renderUploadReceiptButton = () => {
    if (
      [
        SignupStatus.PAYMENT_PENDING,
        SignupStatus.PAYMENT_DELAYED,
        SignupStatus.PAYMENT_TO_CONFIRM,
        SignupStatus.FLAGGED
      ].includes(signUpDetails.status)
    )
      return (
        <Grid item>
          {SignupStatus.PAYMENT_PENDING === signUpDetails.status
            ? t(`${SCOPES.MODULES.SIGN_UP}.uploadReceipt`).toUpperCase()
            : t(`${SCOPES.MODULES.SIGN_UP}.uploadAnotherReceipt`).toUpperCase()}
          <FileUpload
            uploadFunction={(file) => uploadEventReceipt(signUpId, etiEventId, userId, file)}
            postUpload={(fileUrl) =>
              setSignUpDetails({
                ...signUpDetails,
                receipt: fileUrl,
                status: SignupStatus.PAYMENT_TO_CONFIRM
              })
            }
            notifications={{
              successMsg: t(`${SCOPES.MODULES.SIGN_UP}.receiptUploadSuccess`),
              errorMsg: t(`${SCOPES.MODULES.SIGN_UP}.receiptUploadError`)
            }}
          />
        </Grid>
      );
  };

  return (
    <Container maxWidth="md">
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
        <Typography> Tu Inscripción está {t(signUpDetails.status)}</Typography>
        <div style={{}}>
          {signUpDetails?.receipt ? <ReceiptDisplay signup={signUpDetails} /> : <></>}{' '}
        </div>
        {renderUploadReceiptButton()}
      </div>
    </Container>
  );
}

export default ReceiptUpload;
