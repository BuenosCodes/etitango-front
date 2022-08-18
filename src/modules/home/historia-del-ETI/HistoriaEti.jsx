import * as React from 'react';
import { Typography, Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
  height: '100vh'
};

function HistoriaEti() {
  const { t } = useTranslation(SCOPES.MODULES.HOME.HISTORY, { useSuspense: false });
  return (
    <React.Fragment>
      <Container>
        <Box sx={item}>
          <Typography variant="h4" align="center" component="h2" my="25px">
            {t('originTitle')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {t('originDescription')}
          </Typography>
          <Typography variant="h4" align="center" component="h2" my="25px">
            {t('etiPhilosophyTitle')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {t('etiPhilosophy')}
          </Typography>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default HistoriaEti;
