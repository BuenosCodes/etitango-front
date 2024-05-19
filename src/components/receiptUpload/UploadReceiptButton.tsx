import { Signup, SignupStatus } from '../../shared/signup';
import React, { useContext } from 'react';
import { EtiEventContext } from '../../helpers/EtiEventContext';
import { UserContext } from '../../helpers/UserContext';
import { Grid } from '@mui/material';
import { t } from 'i18next';
import { SCOPES } from '../../helpers/constants/i18n';
import FileUpload from '../FileUpload';
import { uploadEventReceipt } from '../../helpers/firestore/signups';

export const UploadReceiptButton = ({ signup }: { signup: Signup }) => {
  const { etiEvent } = useContext(EtiEventContext);
  const { user } = useContext(UserContext);
  if (!etiEvent || !user) return <></>;
  if (
    [
      SignupStatus.PAYMENT_PENDING,
      SignupStatus.PAYMENT_DELAYED,
      SignupStatus.PAYMENT_TO_CONFIRM,
      SignupStatus.FLAGGED
    ].includes(signup.status!)
  )
    return (
      <>
        <Grid item>
          {SignupStatus.PAYMENT_PENDING === signup.status
            ? t(`${SCOPES.MODULES.SIGN_UP}.uploadReceipt`).toUpperCase()
            : t(`${SCOPES.MODULES.SIGN_UP}.uploadAnotherReceipt`).toUpperCase()}
          <FileUpload
            uploadFunction={(file: File) =>
              uploadEventReceipt(signup.id, etiEvent?.id!, user.uid, file)
            }
            notifications={{
              successMsg: t(`${SCOPES.MODULES.SIGN_UP}.receiptUploadSuccess`),
              errorMsg: t(`${SCOPES.MODULES.SIGN_UP}.receiptUploadError`)
            }}
          />
        </Grid>
      </>
    );
  return <></>;
};
