import React, { useContext, useEffect, useState } from 'react';
import { CircularProgress, Container, Grid, Typography } from '@mui/material';
import WithAuthentication from '../withAuthentication';
import { getSignupForUserAndEvent } from '../../helpers/firestore/signups';
import { UserContext } from '../../helpers/UserContext';
import { CompleteProfileAlert } from '../user/components/completeProfileAlert';
import { EtiEventContext } from '../../helpers/EtiEventContext';
import { SignupForm } from './SignupForm';
import { SignupStatusDisplay } from '../components/SignupStatusDisplay';
import { SignupClosed } from './SignupClosed';
import { Title } from './Title';
import { Signup } from '../../shared/signup';
import { Unsubscribe } from 'firebase/firestore';

export default function Index() {
  const [signupDetails, setSignupDetails] = useState<Signup>();
  const { user } = useContext(UserContext);
  const { etiEvent } = useContext(EtiEventContext);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    let unsubscribe: Unsubscribe;
    async function fetch() {
      console.log('*******_debug  index.tsx:22 fetch '); // TODO
      if (user.uid && etiEvent?.id) {
        unsubscribe = await getSignupForUserAndEvent(
          user.uid,
          etiEvent.id,
          setSignupDetails,
          setIsLoading
        );
      }
    }

    fetch();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, etiEvent]);
  const shouldShowSignupForm = user && etiEvent?.id && !signupDetails?.id;

  if (isLoading) {
    return <CircularProgress />;
  }
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
            {shouldShowSignupForm ? <SignupForm /> : null}
            {signupDetails?.id ? <SignupStatusDisplay signupDetails={signupDetails} /> : null}
          </Grid>
        </Container>
      </>
    );
}
