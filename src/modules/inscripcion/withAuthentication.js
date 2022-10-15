import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { getUser } from '../../helpers/firestore/users';
import { UserContext } from '../../helpers/UserContext';
import { CircularProgress } from '@mui/material';

const WithAuthentication = (props) => {
  const auth = getAuth();
  const { user, setUser } = useContext(UserContext);
  const [ran, setRan] = useState(false);
  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const u = await getUser(user.uid);
        setUser({ ...user, data: u });
      }
      setRan(true);
    });

    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, [auth]);

  return (
    <>
      {!ran && <CircularProgress />}
      {ran && !user?.emailVerified && (
        // eslint-disable-next-line react/prop-types
        <Navigate to="/sign-in" replace state={{ redirectUrl: props.redirectUrl }} />
      )}
    </>
  );
};
export default WithAuthentication;
