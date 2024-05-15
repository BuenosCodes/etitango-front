import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import WithAuthentication from '../withAuthentication';
import { getSignupForUserAndEvent, resetSignup } from '../../helpers/firestore/signups';
import { auth } from '../../etiFirebase';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { getDocument } from '../../helpers/firestore/index.js';
import { USERS } from '../../helpers/firestore/users';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../App.js';
import { UserContext } from '../../helpers/UserContext';
import { CompleteProfileAlert } from '../user/components/completeProfileAlert';
import { EtiEventContext } from '../../helpers/EtiEventContext';
import { SignupForm } from './SignupForm';
import * as PropTypes from 'prop-types';
import { SignupStatusDisplay } from '../components/SignupStatusDisplay.jsx';

/* eslint-disable react/prop-types */
export function ResetSignup({ etiEventId, signupId }) {
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
function Title({ etiEvent }) {
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP], {
    useSuspense: false
  });
  return (
    <Grid item sx={{ mb: 3 }}>
      <Typography variant="h5" color="secondary" align="center">
        {t(`${SCOPES.MODULES.SIGN_UP}.title`)}
      </Typography>
      <Typography variant="h5" color="secondary" align="center">
        {etiEvent?.name}
      </Typography>
    </Grid>
  );
}

Title.propTypes = {
  t: PropTypes.any,
  etiEvent: PropTypes.shape({
    dateStart: PropTypes.any,
    dateEnd: PropTypes.any,
    dateSignupOpen: PropTypes.any,
    comboReturnDeadline: PropTypes.any,
    prices: PropTypes.arrayOf(PropTypes.any),
    id: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    location: PropTypes.string,
    admins: PropTypes.arrayOf(PropTypes.string),
    capacity: PropTypes.number,
    daysBeforeExpiration: PropTypes.number,
    bank: PropTypes.shape({
      entity: PropTypes.string,
      holder: PropTypes.string,
      cbu: PropTypes.string,
      alias: PropTypes.string,
      cuit: PropTypes.string
    }),
    schedule: PropTypes.arrayOf(
      PropTypes.shape({ title: PropTypes.string, activities: PropTypes.string })
    ),
    locations: PropTypes.arrayOf(
      PropTypes.shape({ name: PropTypes.string, link: PropTypes.string })
    ),
    landingTitle: PropTypes.string,
    comboReturnDeadlineHuman: PropTypes.string
  })
};

function SignupClosed({ etiEvent }) {
  return (
    <Typography color={'error.dark'} textAlign={'center'}>
      t(`${SCOPES.MODULES.SIGN_UP}.signupClosed`) {etiEvent.dateSignupOpen.toLocaleString()}
    </Typography>
  );
}

SignupClosed.propTypes = {
  t: PropTypes.any,
  etiEvent: PropTypes.shape({
    dateStart: PropTypes.any,
    dateEnd: PropTypes.any,
    dateSignupOpen: PropTypes.any,
    comboReturnDeadline: PropTypes.any,
    prices: PropTypes.arrayOf(PropTypes.any),
    id: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    location: PropTypes.string,
    admins: PropTypes.arrayOf(PropTypes.string),
    capacity: PropTypes.number,
    daysBeforeExpiration: PropTypes.number,
    bank: PropTypes.shape({
      entity: PropTypes.string,
      holder: PropTypes.string,
      cbu: PropTypes.string,
      alias: PropTypes.string,
      cuit: PropTypes.string
    }),
    schedule: PropTypes.arrayOf(
      PropTypes.shape({ title: PropTypes.string, activities: PropTypes.string })
    ),
    locations: PropTypes.arrayOf(
      PropTypes.shape({ name: PropTypes.string, link: PropTypes.string })
    ),
    landingTitle: PropTypes.string,
    comboReturnDeadlineHuman: PropTypes.string
  })
};

SignupStatusDisplay.propTypes = {
  t: PropTypes.any,
  signUpDetails: PropTypes.any,
  user: PropTypes.any,
  etiEvent: PropTypes.shape({
    dateStart: PropTypes.any,
    dateEnd: PropTypes.any,
    dateSignupOpen: PropTypes.any,
    comboReturnDeadline: PropTypes.any,
    prices: PropTypes.arrayOf(PropTypes.any),
    id: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    location: PropTypes.string,
    admins: PropTypes.arrayOf(PropTypes.string),
    capacity: PropTypes.number,
    daysBeforeExpiration: PropTypes.number,
    bank: PropTypes.shape({
      entity: PropTypes.string,
      holder: PropTypes.string,
      cbu: PropTypes.string,
      alias: PropTypes.string,
      cuit: PropTypes.string
    }),
    schedule: PropTypes.arrayOf(
      PropTypes.shape({ title: PropTypes.string, activities: PropTypes.string })
    ),
    locations: PropTypes.arrayOf(
      PropTypes.shape({ name: PropTypes.string, link: PropTypes.string })
    ),
    landingTitle: PropTypes.string,
    comboReturnDeadlineHuman: PropTypes.string
  }),
  signUpDetails1: PropTypes.func
};
// };
export default function Inscripcion() {
  const [userData, setUserData] = useState({});
  // const [loading, setLoading] = useState(true);
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
              <SignupStatusDisplay />
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
