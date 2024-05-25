import { useTranslation } from 'react-i18next';
import { SCOPES } from '../../helpers/constants/i18n';
import { Grid, Typography } from '@mui/material';
import React from 'react';
import { EtiEvent } from '../../shared/etiEvent';

export function Title({ etiEvent }: { etiEvent: EtiEvent }) {
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP], {
    useSuspense: false
  });
  return (
    <Grid item sx={{ mb: 3 }}>
      <Typography variant="h5" color="secondary" align="center">
        {t(`${SCOPES.MODULES.SIGN_UP}.title`)}
      </Typography>
      <Typography variant="h5" color="secondary" align="center">
        {etiEvent?.name}
      </Typography>
    </Grid>
  );
}
