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
      {etiEvent?.prices.map(({ price, deadlineHuman }, i) => (
        <Typography key={'prices_' + i}>
          {argentinaCurrencyFormatter.format(price + (orderNumber || 0) / 100)} hasta el{' '}
          {deadlineHuman} (inclusive)
        </Typography>
      ))}
    </Grid>
  );
}
