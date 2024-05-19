import { SCOPES } from '../../helpers/constants/i18n';
import { Container, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ReceiptDisplay } from '../ReceiptDisplay';
import { UploadReceiptButton } from './UploadReceiptButton';
import { Signup } from '../../shared/signup';
import { EtiEventContext } from '../../helpers/EtiEventContext';
import { ComboPricingDisplay } from '../../modules/components/ComboPricingDisplay';

function ReceiptUpload({ signupDetails }: { signupDetails: Signup }) {
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP], {
    useSuspense: false
  });
  const { etiEvent } = useContext(EtiEventContext);
  return (
    <Container maxWidth="md">
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
        <Typography> Tu Inscripción está {t(signupDetails.status)}</Typography>
        {signupDetails?.receipt ? <ReceiptDisplay signup={signupDetails} /> : <></>}
        <UploadReceiptButton signup={signupDetails} />
        <Typography variant="h6">Datos para la transferencia</Typography>

        {Object.entries(etiEvent.bank).map(([k, v]) => (
          <React.Fragment key={k}>
            <Typography>
              {t(k)}: {v}
            </Typography>
          </React.Fragment>
        ))}
        <ComboPricingDisplay />
      </div>
    </Container>
  );
}

export default ReceiptUpload;
