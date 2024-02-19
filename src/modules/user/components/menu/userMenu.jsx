import { useContext } from 'react';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ROUTES } from 'App.js';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { styles } from './userMenu.styles.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../helpers/UserContext';
import { isAdmin } from '../../../../helpers/firestore/users';

export function UserMenu() {
  const { t } = useTranslation(SCOPES.MODULES.USER, { useSuspense: false });
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { pathname: currentRoute } = useLocation();
  const isCurrentRoute = (route) => currentRoute === route;
  const getStyles = (route) => [styles.item, isCurrentRoute(route) && { ...styles.selectedItem }];

  return (
    <>
      <Box sx={styles.container}>
        <Button sx={getStyles(ROUTES.PROFILE)} onClick={() => navigate(ROUTES.PROFILE)}>
          {t('myProfile')}
        </Button>
        <Button sx={getStyles(ROUTES.SIGNUP)} onClick={() => navigate(ROUTES.SIGNUP)}>
          {t('signup')}
        </Button>
        <Button sx={getStyles(ROUTES.SIGNUPS)} onClick={() => navigate(ROUTES.SIGNUPS)}>
          {t('signupList')}
        </Button>
        {isAdmin(user) ? (
          <Button sx={getStyles(ROUTES.SIGNUPS)} onClick={() => navigate(ROUTES.ATTENDANCE)}>
            {t('attendance')}
          </Button>
        ) : null}
      </Box>
    </>
  );
}
