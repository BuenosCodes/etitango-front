import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { auth, uiConfig } from 'etiFirebase';
import { Navigate } from 'react-router-dom';
import { sendVerificationEmail } from '../../helpers/firebaseAuthentication.js';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { ROUTES } from 'App.js';
import { Button, Typography } from '@mui/material';

function SignInScreen() {
  const { t } = useTranslation([SCOPES.MODULES.SIGN_IN], {
    useSuspense: false
  });

  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [isVerified, setIsVerified] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
      setIsVerified(user?.emailVerified);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p>{t('notSignedIn')}</p>

        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />

        <Button href={ROUTES.INSTRUCTIONS} variant={'contained'}>
          <Typography>Dudas? Mirá el Instructivo</Typography>
        </Button>
      </div>
    );
  }
  if (!isVerified) {
    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px' }}
      >
        <p>{t('emailNotValidated')}</p>
        <p>
          {t('verificationMailNotReceived')}{' '}
          <Button color="secondary" variant="contained" onClick={sendVerificationEmail}>
            {t('resend').toUpperCase()}
          </Button>
        </p>
        <p>{t('checkSpamFolder')}</p>
      </div>
    );
  }
  return <Navigate to={ROUTES.USER_HOME} />;
}

export default SignInScreen;
