import React from 'react';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import YouTube from 'react-youtube';
import { Grid, Typography } from '@mui/material';
function Intructions() {
  const { t } = useTranslation([SCOPES.MODULES.INSTRUCTIONS], {
    useSuspense: false
  });

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <Typography variant="h5" color="secondary" align="center">
          {t('instructions')}
        </Typography>
      </Grid>
      <Grid
        item
        style={{
          display: 'flex',
          alignSelf: 'center'
        }}
      >
        <YouTube videoId="AAwbvGywdOc" />
      </Grid>
    </Grid>
  );
}

export default Intructions;
