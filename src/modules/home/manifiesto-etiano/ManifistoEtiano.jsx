import * as React from 'react';
import { Typography, Box, Container, Grid, Card } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
  height: '100vh'
};

function ManifiestoETiano() {
  const { t } = useTranslation(SCOPES.MODULES.HOME.MANIFEST, { useSuspense: false });
  return (
    <React.Fragment>
      <Container>
        <Box sx={item}>
          <Typography variant="h4" align="center" component="h2" my="25px">
            {t('title')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <Typography variant="h6" gutterBottom component="div">
              {t('principles_title')}
            </Typography>
            <div align="center">
              <Grid container spacing={1}>
                <Grid item md={4}>
                  <Card>
                    <Typography>{t('principle_1')}</Typography>
                  </Card>
                </Grid>
                <Grid item md={4}>
                  <Card>
                    <Typography>{t('principle_2')}</Typography>
                  </Card>
                </Grid>
                <Grid item md={4}>
                  <Card>
                    <Typography>{t('principle_3')}</Typography>
                  </Card>
                </Grid>
                <Grid item md={4}>
                  <Card>
                    <Typography>{t('principle_4')}</Typography>
                  </Card>
                </Grid>
                <Grid item md={4}>
                  <Card>
                    <Typography>{t('principle_5')}</Typography>
                  </Card>
                </Grid>
                <Grid item md={4}>
                  <Card>
                    <Typography>{t('principle_6')}</Typography>
                  </Card>
                </Grid>
                <Grid item md={4}>
                  <Card>
                    <Typography>{t('principle_7')}</Typography>
                  </Card>
                </Grid>
                <Grid item md={4}>
                  <Card>
                    <Typography>{t('principle_8')}</Typography>
                  </Card>
                </Grid>
                <Grid item md={4}>
                  <Card>
                    <Typography>{t('principle_9')}</Typography>
                  </Card>
                </Grid>
                <Grid item md={4}>
                  <Card></Card>
                </Grid>
                <Grid item md={4}>
                  <Card>
                    <Typography>{t('principle_10')}</Typography>
                  </Card>
                </Grid>
              </Grid>
            </div>
            <br />
            <Typography variant="h6" gutterBottom component="div">
              {t('assembly_title')}
            </Typography>
            <br />
            <div align="center">
              {t('assembly_1')}
              <br />
              <hr />
              {t('assembly_2')}
              <br />
              <hr />
              {t('assembly_3')}
              <br />
              <hr />
              {t('assembly_4')}
              <br />
              <hr />
              {t('assembly_5')}
              <br />
              <hr />
              {t('assembly_6')}
              <br />
              <hr />
              {t('assembly_7')}
              <br />
              <br />
            </div>
            <Typography variant="h6" gutterBottom component="div">
              {t('events_title')}
            </Typography>
            <div>
              {t('events_1_1')}
              <span style={{ color: '#009900' }}>{t('events_eti')}</span>
              {t('events_1_2')} <br />
              <br />
              {t('events_2_1')}
              <span style={{ color: '#FF6666' }}>{t('events_amo')}</span>
              {t('events_2_2')} <br />
              <br />
              {t('events_3_1')}
              <span style={{ color: '#009900' }}>{t('events_eti')}</span>
              {t('events_dot')} <br />
              <br />
              {t('events_4')} <br />
              <br />
              {t('events_5_1')}
              <span style={{ color: '#FF6666' }}>{t('events_amo')}</span>
              {t('events_5_2')}
              <span style={{ color: '#009900' }}>{t('events_eti')}</span>
              {t('events_dot')} <br />
              <br />
              {t('events_6_1')}
              <span style={{ color: '#FF6666' }}>{t('events_amo')}</span>
              {t('events_6_2')} <br />
              <br />
              {t('events_7')} <br />
              <br />
              {t('events_8')}
              <span style={{ color: '#009900' }}>{t('events_eti')}</span>
              {t('events_dot')} <br />
              <br />
              {t('events_9')} <br />
              <br />
            </div>
            <Typography variant="h6" gutterBottom component="div">
              {t('annex_title')}
            </Typography>
            <Typography variant="h6" gutterBottom component="div">
              {t('annex_sub_1')}
            </Typography>
            <Typography variant="h6" gutterBottom component="div" align="right" fontSize={10}>
              {' '}
              {/* TODO variant="h7" "small-right" */}
              {t('annex_sub_2')} <br /> {t('annex_sub_3')}
            </Typography>
            <div>
              {t('annex_1')} <br /> {t('annex_2')} <br />
              {t('annex_3')} <br /> {t('annex_4')} <br />
              {t('annex_5')}
              {t('annex_6')} <br /> {t('annex_7')} <br />
              {t('annex_8')} <br /> {t('annex_9')} <br />
              {t('annex_10')}
              {t('annex_11')} <br /> {t('annex_12')} <br />
              {t('annex_13')} <br /> {t('annex_14')} <br />
              {t('annex_15')}
              {t('annex_16')} <br /> {t('annex_17')} <br />
              {t('annex_18')} <br /> {t('annex_19')} <br />
              {t('annex_20')}
              {t('annex_21')}
            </div>
          </Typography>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default ManifiestoETiano;
