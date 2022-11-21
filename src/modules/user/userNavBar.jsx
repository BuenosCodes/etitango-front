import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ROUTES } from 'App';
import { SCOPES } from 'helpers/constants/i18n';

export function UserNavBar() {
  const { t } = useTranslation([SCOPES.MODULES.USER], { useSuspense: false });
  return (
    <>
      <Button href={ROUTES.PROFILE}>{t('myProfile')}</Button>
      <Button href={ROUTES.SIGNUP}>{t('signup')}</Button>
      <Button href={ROUTES.SIGNUPS}>{t('signupList')}</Button>
    </>
  );
}
