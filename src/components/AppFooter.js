import * as React from 'react';
import { Grid, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';

export default function AppFooter() {
  const { t } = useTranslation(SCOPES.COMPONENTS.FOOTER, { useSuspense: false });
  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid
          container
          direction="column"
          alignItems="center"
          spacing={2}
          sx={{ bgcolor: 'info.dark', paddingBottom: 5 }}
        >
          <Grid item>
            <Link href="http://facebook.com/groups/305562943758" target="_blank">
              <FacebookIcon sx={{ color: 'white', fontSize: '56px' }} />
            </Link>
          </Grid>
          <Grid item variant="body1" sx={{ color: 'white' }}>
            {t('footer')}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
