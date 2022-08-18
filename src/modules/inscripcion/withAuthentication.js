import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../App.js';
import { auth } from 'etiFirebase.js';

const WithAuthentication = (props) => {
  const { user, setUser } = useContext(UserContext);
  const [ran, setRan] = useState(false);
  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      setUser(user);
      setRan(true);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, [auth, setUser]);

  return (
    <>
      {ran && !user && (
        <Navigate to="/sign-in" replace state={{ redirectUrl: props.redirectUrl }} />
      )}
    </>
  );
};
export default WithAuthentication;
