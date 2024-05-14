import React, { useContext, useEffect, useState } from 'react';
import { Button, CircularProgress, Container, Grid, Typography } from '@mui/material';
import WithAuthentication from '../withAuthentication';
import { getSignupForUserAndEvent, resetSignup } from '../../helpers/firestore/signups';
import { auth } from '../../etiFirebase';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { SignupStatus } from '../../shared/signup';
import { getDocument } from '../../helpers/firestore/index.js';
import { USERS } from '../../helpers/firestore/users';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../App.js';
import ReceiptUpload from '../../components/receiptUpload/index';
import { UserContext } from '../../helpers/UserContext';
import { CompleteProfileAlert } from '../user/components/completeProfileAlert';
import { EtiEventContext } from '../../helpers/EtiEventContext';
import { SignupForm } from './SignupForm.jsx';

/* eslint-disable react/prop-types */
function ResetSignup({ etiEventId, signupId }) {
  const navigate = useNavigate();
  const handleClick = async () => {
    await resetSignup(etiEventId, signupId);
    navigate(ROUTES.SIGNUPS);
  };
  return (
    <>
      <Typography>Tu inscripción está Cancelada</Typography>
      <Button onClick={handleClick} variant={'contained'} color={'secondary'}>
        <Typography>Reinscribirme</Typography>
      </Button>
    </>
  );
}

// SignupForm.propTypes = {
//   userData: PropTypes.shape({}),
//   etiEvent: PropTypes.func,
//   validationSchema: PropTypes.any,
//   onSubmit: PropTypes.func,
//   prop4: PropTypes.func
// };
export default function Inscripcion() {
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP], {
    useSuspense: false
  });

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser?.uid) {
        const user = await getDocument(`${USERS}/${auth.currentUser.uid}`);
        setUserData(user);
        setLoading(false);
      }
    };
    fetchData().catch((error) => console.error(error));
  }, [auth.currentUser?.uid]);

  const renderAlreadySignedUpMessage = () => (
    <Grid item style={{ textAlign: 'center' }}>
      <Typography variant="h6">{t(`${SCOPES.MODULES.SIGN_UP}.alreadySignedUpReason`)}</Typography>
      {signUpDetails.status === SignupStatus.CANCELLED ? (
        <ResetSignup user={user} etiEventId={etiEvent.id} signupId={signUpDetails.id} />
      ) : (
        <ReceiptUpload
          etiEventId={etiEvent?.id}
          signUpDetails={signUpDetails}
          userId={auth.currentUser?.uid}
          setSignUpDetails={setSignUpDetails}
        />
      )}
    </Grid>
  );

  return (
    <>
      <WithAuthentication />
      <CompleteProfileAlert />
      <Container maxWidth="lg" sx={{ marginTop: 3 }}>
        {etiEvent?.dateSignupOpen > new Date() ? (
          <Typography color={'error.dark'} textAlign={'center'}>
            {t(`${SCOPES.MODULES.SIGN_UP}.signupClosed`)} {etiEvent.dateSignupOpen.toLocaleString()}
          </Typography>
        ) : (
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={3}
          >
            <Grid item sx={{ mb: 3 }}>
              <Typography variant="h5" color="secondary" align="center">
                {t(`${SCOPES.MODULES.SIGN_UP}.title`)}
              </Typography>
              <Typography variant="h5" color="secondary" align="center">
                {etiEvent?.name}
              </Typography>
            </Grid>
            {loading ? (
              <CircularProgress />
            ) : signUpDetails?.id ? (
              renderAlreadySignedUpMessage()
            ) : (
              <SignupForm
                userData={userData}
                etiEvent={etiEvent}
                isSignedUp={!!signUpDetails?.id}
              />
            )}
          </Grid>
        )}
      </Container>
    </>
  );
}
