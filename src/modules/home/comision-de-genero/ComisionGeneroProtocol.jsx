import * as React from 'react';
import { Typography, Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'left',
  px: 5,
  height: '100vh'
};

function ComisionGeneroProtocol() {
  const { t } = useTranslation(SCOPES.MODULES.HOME.GENDER.PROT, { useSuspense: false });
  return (
    <React.Fragment>
      <Container>
        <Box sx={item}>
          <Typography variant="h4" align="center" component="h2" my="25px">
            {t('title')}
          </Typography>
          <Typography variant="h6" gutterBottom component="div">
            {' '}
            {t('subtitle_1')}{' '}
          </Typography>
          <Typography> {t('body_1')} </Typography>
          <Typography> {t('def_1')} </Typography> <br />
          <Typography variant="h6" gutterBottom component="div">
            {' '}
            {t('subtitle_2')}{' '}
          </Typography>
          <ul>
            {t('body_2')
              .split('\n')
              .map((tx, i) => (
                <li key={i}>
                  <Typography> {tx}</Typography>
                </li>
              ))}{' '}
          </ul>
          <br />
          <Typography variant="h6" gutterBottom component="div">
            {' '}
            {t('subtitle_3')}{' '}
          </Typography>
          <Typography> {t('body_3')} </Typography> <br />
          <Typography variant="h6" gutterBottom component="div">
            {' '}
            {t('subtitle_4')}{' '}
          </Typography>
          <ul>
            {t('body_4')
              .split('\n')
              .map((tx, i) => (
                <li key={i}>
                  <Typography> {tx}</Typography>
                </li>
              ))}{' '}
          </ul>
          <br />
          <Typography variant="h6" gutterBottom component="div">
            {' '}
            {t('subtitle_5')}{' '}
          </Typography>
          <Typography> {t('body_5')} </Typography> <br />
          <Typography variant="h6" gutterBottom component="div">
            {' '}
            {t('subtitle_6')}{' '}
          </Typography>
          <Typography variant="h6" gutterBottom component="div">
            {' '}
            {t('subtitle_7')}{' '}
          </Typography>
          <ul>
            {t('body_6')
              .split('\n')
              .map((tx, i) => (
                <li key={i}>
                  <Typography> {tx}</Typography>
                </li>
              ))}{' '}
          </ul>
          <br />
          <Typography variant="h6" gutterBottom component="div">
            {' '}
            {t('subtitle_8')}{' '}
          </Typography>
          <ul>
            {t('body_7')
              .split('\n')
              .map((tx, i) => (
                <li key={i}>
                  <Typography> {tx}</Typography>
                </li>
              ))}{' '}
          </ul>
          <br />
          <Typography variant="h6" gutterBottom component="div">
            {' '}
            {t('subtitle_9')}{' '}
          </Typography>
          <Typography variant="h6" gutterBottom component="div">
            {' '}
            {t('body_8')}{' '}
          </Typography>
          <ul>
            {t('body_9')
              .split('\n')
              .map((tx, i) => (
                <li key={i}>
                  <Typography> {tx}</Typography>
                </li>
              ))}{' '}
          </ul>
          <br />
          <br />
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default ComisionGeneroProtocol;
