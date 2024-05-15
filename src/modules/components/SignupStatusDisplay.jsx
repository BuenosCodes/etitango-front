import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../helpers/UserContext';
import { EtiEventContext } from '../../helpers/EtiEventContext';
import { useTranslation } from 'react-i18next';
import { SCOPES } from '../../helpers/constants/i18n';
import { getSignupForUserAndEvent } from '../../helpers/firestore/signups';
import { Grid, Typography } from '@mui/material';
import { SignupStatus } from '../../shared/signup';
import ReceiptUpload from '../../components/receiptUpload/index';
import { auth } from '../../etiFirebase';
import { ResetSignup } from '../inscripcion/Inscripcion.jsx';

export function SignupStatusDisplay() {
  const [signUpDetails, setSignUpDetails] = useState(null);
  const { user } = useContext(UserContext);
  const { etiEvent } = useContext(EtiEventContext);
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP], {
    useSuspense: false
  });

  useEffect(() => {
    async function fetch() {
      if (user.uid && etiEvent?.id) {
        setSignUpDetails(await getSignupForUserAndEvent(user.uid, etiEvent.id));
      }
    }

    fetch();
  }, [user]);
  if (!signUpDetails) return <></>;
  return (
    <Grid item style={{ textAlign: 'center' }}>
      <Typography variant="h6">{t(`${SCOPES.MODULES.SIGN_UP}.alreadySignedUpReason`)}</Typography>
      {signUpDetails?.status === SignupStatus.CANCELLED ? (
        <ResetSignup user={user} etiEventId={etiEvent.id} signupId={signUpDetails.id} />
      ) : (
        <ReceiptUpload
          etiEventId={etiEvent?.id}
          signUpDetails={signUpDetails}
          userId={auth.currentUser?.uid}
          setSignUpDetails={signUpDetails}
        />
      )}
    </Grid>
  );
}
