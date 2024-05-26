import React, { useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import { argentinaCurrencyFormatter, SCOPES } from '../../helpers/constants/i18n';
import { EtiEventContext } from '../../helpers/EtiEventContext';
import { useTranslation } from 'react-i18next';

export function ComboPricingDisplay({ orderNumber }: { orderNumber?: number }) {
  const { etiEvent } = useContext(EtiEventContext);
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP], {
    useSuspense: false
  });

  return (
    <Grid item style={{ textAlign: 'center' }} justifyContent={'center'}>
      <Typography variant="h3" color="primary" align="center">
        {t(`${SCOPES.MODULES.SIGN_UP}.combo`)}
      </Typography>
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Typography variant="caption">
          ATENCIÓN: el precio final del combo es la suma del precio base más unos centavos que se corresponden
          con tu número de orden. Esto es para que la organización identifique más fácil e inequívocamente tu pago. Te
          compartimos el precio base para que lo tengas de referencia pero por favor transferí el monto que te vamos a
          indicar una vez que se te habilite a pagar tu combo.</Typography>
      </div>
      {etiEvent?.prices.map(({ price, deadlineHuman }, i) => (
        <Typography key={'prices_' + i}>
          {argentinaCurrencyFormatter.format(price + (orderNumber || 0) / 100)} hasta el{' '}
          {deadlineHuman} (inclusive)
        </Typography>
      ))}
    </Grid>
  );
}
