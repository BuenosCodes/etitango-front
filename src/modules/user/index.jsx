import React from 'react';
import WithAuthentication from '../withAuthentication';
import { SCOPES } from '../../helpers/constants/i18n';
import { Translation } from 'react-i18next';
import { Typography } from '@mui/material';

export default function UserHome() {
  return (
    <Translation ns={SCOPES.MODULES.USER_HOME} useSuspense={false}>
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
        </>
      )}
    </Translation>
  );
}
