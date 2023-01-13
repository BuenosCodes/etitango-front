import { useContext, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ROUTES } from 'App.js';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { styles } from './userMenu.styles.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../helpers/UserContext';
import { isUserDataComplete } from '../../../../helpers/validators';
import { Alert } from '../../../../components/alert/Alert';

export function UserMenu() {
  const [alertVisible, setAlertVisible] = useState(false);
  const { t } = useTranslation(SCOPES.MODULES.USER, { useSuspense: false });
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { pathname: currentRoute } = useLocation();
  const isCurrentRoute = (route) => currentRoute === route;
  const getStyles = (route) => [styles.item, isCurrentRoute(route) && { ...styles.selectedItem }];
  const checkUserData = () => {
    if (isUserDataComplete(user.data)) {
      navigate(ROUTES.SIGNUP);
    } else {
      setAlertVisible(true);
    }
  };
  return (
    <>
      <Alert
        open={alertVisible}
        handleClose={() => setAlertVisible(false)}
        onClick={() => {
          navigate(ROUTES.PROFILE);
          setAlertVisible(false);
        }}
        buttonText={t('alert.fillInData').toUpperCase()}
        title={t('alert.warning')}
        description={t('alert.fillInDataReason')}
      />
      <Box sx={styles.container}>
        <Button sx={getStyles(ROUTES.PROFILE)} onClick={() => navigate(ROUTES.PROFILE)}>
          {t('myProfile')}
        </Button>
        <Button sx={getStyles(ROUTES.SIGNUP)} onClick={checkUserData}>
          {t('signup')}
        </Button>
        <Button sx={getStyles(ROUTES.SIGNUPS)} onClick={() => navigate(ROUTES.SIGNUPS)}>
          {t('signupList')}
        </Button>
      </Box>
    </>
  );
}
