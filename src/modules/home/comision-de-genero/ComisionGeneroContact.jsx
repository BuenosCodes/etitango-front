import * as React from 'react';
import { Typography, Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'left',
  px: 5
};

function ComisionGeneroContact() {
  const { t } = useTranslation(SCOPES.MODULES.HOME.GENDER.CONT, { useSuspense: false });
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
          <Typography>
            {' '}
            {t('body_1')}{' '}
            <a
              href="https://www.facebook.com/Comisiondegenerotango/"
              target="_blank"
              rel="noreferrer"
            >
              Link
            </a>
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
            {t('subtitle_2')}{' '}
          </Typography>
          <ul>
            {t('body_3')
              .split('\n')
              .map((tx, i) => (
                <li key={i}>
                  <Typography> {tx}</Typography>
                </li>
              ))}{' '}
          </ul>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default ComisionGeneroContact;
