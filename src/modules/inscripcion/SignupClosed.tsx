import React from 'react';
import { Typography } from '@mui/material';
import { SCOPES } from '../../helpers/constants/i18n';
import { EtiEvent } from '../../shared/etiEvent';

export function SignupClosed({ etiEvent }: { etiEvent: EtiEvent }) {
  return (
    <Typography color={'error.dark'} textAlign={'center'}>
      t(`${SCOPES.MODULES.SIGN_UP}.signupClosed`) {etiEvent.dateSignupOpen.toLocaleString()}
    </Typography>
  );
}
