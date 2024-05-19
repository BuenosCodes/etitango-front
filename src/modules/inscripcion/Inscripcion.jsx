import React, { useContext, useEffect, useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import WithAuthentication from '../withAuthentication';
import { getSignupForUserAndEvent } from '../../helpers/firestore/signups';
import { auth } from '../../etiFirebase';
import { getDocument } from '../../helpers/firestore/index.js';
import { USERS } from '../../helpers/firestore/users';
import { UserContext } from '../../helpers/UserContext';
import { CompleteProfileAlert } from '../user/components/completeProfileAlert';
import { EtiEventContext } from '../../helpers/EtiEventContext';
import { SignupForm } from './SignupForm';
import { SignupStatusDisplay } from '../components/SignupStatusDisplay';
import { SignupClosed } from './SignupClosed';
import { Title } from './Title';

export default function Inscripcion() {
  const [userData, setUserData] = useState({});
  const [signUpDetails, setSignUpDetails] = useState({});
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
        // setLoading(false);
      }
    };
    fetchData().catch((error) => console.error(error));
  }, [auth.currentUser?.uid]);

  if (!etiEvent?.id) {
    return (
      <Typography variant="h5" color="secondary" align="center" my={4}>
        El pŕoximo ETI viene pronto!
      </Typography>
    );
  } else
    return (
      <>
        <WithAuthentication />
        <CompleteProfileAlert />
        <Container maxWidth="lg" sx={{ marginTop: 3 }}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={3}
          >
            <Title etiEvent={etiEvent} />
            {etiEvent?.dateSignupOpen > new Date() ? <SignupClosed etiEvent={etiEvent} /> : null}
            {signUpDetails?.id ? (
              <SignupStatusDisplay signupDetails={signUpDetails} />
            ) : (
              <SignupForm
                userData={userData}
                etiEvent={etiEvent}
                isSignedUp={!!signUpDetails?.id}
              />
            )}
          </Grid>
        </Container>
      </>
    );
}
