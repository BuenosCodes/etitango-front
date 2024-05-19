import { SCOPES } from '../../helpers/constants/i18n';
import { Container, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReceiptDisplay } from '../ReceiptDisplay';
import { UploadReceiptButton } from './UploadReceiptButton';
import { Signup } from '../../shared/signup';

function ReceiptUpload({ signupDetails }: { signupDetails: Signup }) {
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP], {
    useSuspense: false
  });

  return (
    <Container maxWidth="md">
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
        <Typography> Tu Inscripción está {t(signupDetails.status)}</Typography>
        <div style={{}}>
          {signupDetails?.receipt ? <ReceiptDisplay signup={signupDetails} /> : <></>}{' '}
        </div>
        <UploadReceiptButton signup={signupDetails} />
      </div>
    </Container>
  );
}

export default ReceiptUpload;
