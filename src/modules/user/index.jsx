import React, { useContext, useEffect, useState } from 'react';
import WithAuthentication from '../withAuthentication';
import { SCOPES } from '../../helpers/constants/i18n';
import { Translation } from 'react-i18next';
import { Box, Button, Typography } from '@mui/material';
import { ROUTES } from '../../App.js';
import { UserContext } from '../../helpers/UserContext';
import { getFutureEti } from '../../helpers/firestore/events';
import { getSignupForUserAndEvent } from '../../helpers/firestore/signups';
import ReceiptUpload from '../../components/receiptUpload/index.jsx';

export default function UserHome() {
  const [signUpDetails, setSignUpDetails] = useState(null);
  const { user } = useContext(UserContext);
  useEffect(() => {
    async function fetch() {
      const futureEtiEvent = await getFutureEti();
      if (user.uid && getFutureEti) {
        setSignUpDetails(await getSignupForUserAndEvent(user.uid, futureEtiEvent.id));
      }
    }

    fetch();
  }, [user]);
  return (
    <Translation ns={[SCOPES.MODULES.USER_HOME, SCOPES.MODULES.INSTRUCTIONS]} useSuspense={false}>
      {(t) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
            margin: '0 auto'
          }}
        >
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
          <Box sx={{ height: '100px' }}>
            <Button href={ROUTES.INSTRUCTIONS} variant={'contained'}>
              <Typography>Dudas? Mirá el Instructivo</Typography>
            </Button>
          </Box>
        </Box>
      )}
    </Translation>
  );
}
