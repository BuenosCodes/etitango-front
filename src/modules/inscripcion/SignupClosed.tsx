import React from 'react';
import { Typography } from '@mui/material';
import { argentinaDateTimeFormatter, SCOPES } from '../../helpers/constants/i18n';
import { EtiEvent } from '../../shared/etiEvent';
import { useTranslation } from 'react-i18next';

export function SignupClosed({ etiEvent }: { etiEvent: EtiEvent }) {
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP], {
    useSuspense: false
  });
  return (
    <Typography color={'error.dark'} textAlign={'center'}>
      {t(`${SCOPES.MODULES.SIGN_UP}.signupClosed`)}{' '}
      {argentinaDateTimeFormatter.format(etiEvent.dateSignupOpen)}
    </Typography>
  );
}
