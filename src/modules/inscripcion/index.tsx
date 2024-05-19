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

export default function Index() {
  const [signupDetails, setSignupDetails] = useState<Signup>();
  const { user } = useContext(UserContext);
  const { etiEvent } = useContext(EtiEventContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let unsubscribe;
    async function fetch() {
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
    return unsubscribe;
  }, [user, etiEvent]);
  const shouldShowSignupForm = user && !signupDetails;
  if (isLoading) {
    return (
      <>
        {isLoading}
        <CircularProgress />
      </>
    );
  }
  if (!isLoading && !etiEvent?.id) {
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
            {shouldShowSignupForm ? <SignupForm etiEvent={etiEvent} /> : null}
            {signupDetails?.id ? <SignupStatusDisplay signupDetails={signupDetails} /> : null}
          </Grid>
        </Container>
      </>
    );
}
