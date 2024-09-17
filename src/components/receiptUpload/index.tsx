import { argentinaDateTimeFormatter, SCOPES } from '../../helpers/constants/i18n';
import { Container, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ReceiptDisplay } from '../ReceiptDisplay';
import { UploadReceiptButton } from './UploadReceiptButton';
import { Signup, SignupStatus } from '../../shared/signup';
import { EtiEventContext } from '../../helpers/EtiEventContext';
import { ComboPricingDisplay } from '../../modules/components/ComboPricingDisplay';
import { addDays } from '../../helpers';

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
        {[SignupStatus.PAYMENT_PENDING, SignupStatus.PAYMENT_DELAYED].includes(
          signupDetails?.status
        ) ? (
          <>
            <Typography variant={'h6'}>
              Tenés hasta el{' '}
              {argentinaDateTimeFormatter.format(
                addDays(signupDetails?.lastModifiedAt, etiEvent.daysBeforeExpiration)
              )}{' '}
              para subir tu comprobante
            </Typography>



            {/*<Typography variant="h3">Datos para la transferencia</Typography>*/}
            {/*{Object.entries(etiEvent.bank).map(([k, v]) => (*/}
            {/*  <React.Fragment key={k}>*/}
            {/*    <Typography>*/}
            {/*      {t(k)}: {v}*/}
            {/*    </Typography>*/}
            {/*  </React.Fragment>*/}
            {/*))}*/}
            <ComboPricingDisplay orderNumber={signupDetails.orderNumber} />
          </>
        ) : (
          <></>
        )}
        <Typography variant={'h6'} py={2}>
              No se realizará reintegro del combo.
            </Typography>
          <Typography variant={'caption'} >
              Quien esté interesado en transferirlo, deberá hacerse cargo de esta operación, previa notificación a la
              organización
            </Typography>
      </div>
    </Container>
  );
}

export default ReceiptUpload;
