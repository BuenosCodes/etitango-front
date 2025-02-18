import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SCOPES } from '../../../helpers/constants/i18n';
import { UserContext } from '../../../helpers/UserContext';
import { useNavigate } from 'react-router-dom';
import { isUserDataComplete } from '../../../helpers/validators';
import { ROUTES } from '../../../App';
import { Alert } from '../../../components/alert/Alert';

export function CompleteProfileAlert() {
  const [alertVisible, setAlertVisible] = useState(false);
  const { t } = useTranslation(SCOPES.MODULES.USER, { useSuspense: false });
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const checkUserData = () => {
    if (!isUserDataComplete(user?.data)) {
      setAlertVisible(true);
    }
  };

  useEffect(() => {
    checkUserData();
  }, [user]);
  return (
    // @ts-ignore
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
  );
}
