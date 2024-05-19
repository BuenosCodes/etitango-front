import React, { useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import { SCOPES } from '../../helpers/constants/i18n';
import { EtiEventContext } from '../../helpers/EtiEventContext';
import { useTranslation } from 'react-i18next';

export function ComboPricingDisplay() {
  const { etiEvent } = useContext(EtiEventContext);
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP], {
    useSuspense: false
  });

  return (
    <Grid item style={{ textAlign: 'center' }} justifyContent={'center'}>
      <Typography variant="h3" color="primary" align="center">
        {t(`${SCOPES.MODULES.SIGN_UP}.combo`)}
      </Typography>
      {etiEvent?.prices.map(({ priceHuman, deadlineHuman }, i) => (
        <Typography key={'prices_' + i}>
          {priceHuman} hasta el {deadlineHuman} (inclusive)
        </Typography>
      ))}
    </Grid>
  );
}
