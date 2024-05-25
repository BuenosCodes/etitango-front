import React from 'react';
import WithAuthentication from '../withAuthentication';
import { SCOPES } from '../../helpers/constants/i18n';
import { Translation } from 'react-i18next';
import { Button, Typography } from '@mui/material';
import { ROUTES } from '../../App.js';
import { SignupStatusDisplay } from '../components/SignupStatusDisplay';

export default function UserHome() {
  return (
    <Translation ns={[SCOPES.MODULES.USER_HOME, SCOPES.MODULES.INSTRUCTIONS]} useSuspense={false}>
      {(t) => (
        <>
          <WithAuthentication />
          <Typography
            variant="h5"
            color={'secondary.main'}
            sx={{ padding: 5, textAlign: 'center' }}
          >
            {t('description')}
          </Typography>
          <SignupStatusDisplay />
          <Button href={ROUTES.INSTRUCTIONS} variant={'contained'}>
            <Typography>Dudas? Mirá el Instructivo</Typography>
          </Button>
        </>
      )}
    </Translation>
  );
}
