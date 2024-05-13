import React, { useContext, useEffect, useState } from 'react';
import WithAuthentication from '../withAuthentication';
import { SCOPES } from '../../helpers/constants/i18n';
import { Translation } from 'react-i18next';
import { Button, Typography } from '@mui/material';
import { ROUTES } from '../../App.js';
import { UserContext } from '../../helpers/UserContext';
import { getSignupForUserAndEvent } from '../../helpers/firestore/signups';
import ReceiptUpload from '../../components/receiptUpload/index.jsx';
import { EtiEventContext } from '../../helpers/EtiEventContext';

export default function UserHome() {
  const [signUpDetails, setSignUpDetails] = useState(null);
  const { user } = useContext(UserContext);
  const { etiEvent } = useContext(EtiEventContext);
  useEffect(() => {
    async function fetch() {
      if (user.uid && etiEvent?.id) {
        setSignUpDetails(await getSignupForUserAndEvent(user.uid, etiEvent.id));
      }
    }

    fetch();
  }, [user]);
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
          {signUpDetails ? (
            <ReceiptUpload signUpDetails={signUpDetails} setSignUpDetails={setSignUpDetails} />
          ) : null}
          <Button href={ROUTES.INSTRUCTIONS} variant={'contained'}>
            <Typography>Dudas? Mirá el Instructivo</Typography>
          </Button>
        </>
      )}
    </Translation>
  );
}
