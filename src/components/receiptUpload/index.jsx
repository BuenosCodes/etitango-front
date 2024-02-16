import { uploadEventReceipt } from '../../helpers/firestore/signups';
import { SCOPES } from '../../helpers/constants/i18n';
import { Container, Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FileUploadOutlined } from '@mui/icons-material';
import React, { useContext, useState } from 'react';
import { NotificationContext } from '../../helpers/NotificationContext';
import { useTranslation } from 'react-i18next';
import { SignupStatus } from '../../shared/signup';
import { ReceiptDisplay } from '../ReceiptDisplay';

/* eslint-disable react/prop-types */
function ReceiptUpload({ signUpDetails, setSignUpDetails }) {
  const { id: signUpId, userId, etiEventId } = signUpDetails;
  const { setNotification } = useContext(NotificationContext);
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP], {
    useSuspense: false
  });
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const handleReceiptUpload = async (receipt) => {
    setUploadingReceipt(true);
    try {
      const fileUrl = await uploadEventReceipt(signUpId, etiEventId, userId, receipt);
      setNotification(t(`${SCOPES.MODULES.SIGN_UP}.receiptUploadSuccess`), { severity: 'info' });
      setSignUpDetails({
        ...signUpDetails,
        receipt: fileUrl,
        status: SignupStatus.PAYMENT_TO_CONFIRM
      });
    } catch (error) {
      setNotification(t(`${SCOPES.MODULES.SIGN_UP}.receiptUploadError`), { severity: 'error' });
    } finally {
      setUploadingReceipt(false);
    }
  };

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
          <LoadingButton
            variant="contained"
            color="secondary"
            component="label"
            loading={uploadingReceipt}
          >
            {SignupStatus.PAYMENT_PENDING === signUpDetails.status
              ? t(`${SCOPES.MODULES.SIGN_UP}.uploadReceipt`).toUpperCase()
              : t(`${SCOPES.MODULES.SIGN_UP}.uploadAnotherReceipt`).toUpperCase()}
            <FileUploadOutlined />
            <input
              style={{ display: 'none' }}
              type="file"
              hidden
              onChange={(e) => handleReceiptUpload(e.target.files[0])}
              accept="image/*, .pdf"
            />
          </LoadingButton>
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
