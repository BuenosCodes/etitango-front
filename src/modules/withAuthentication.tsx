import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { getAuth, User } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { getUser } from '../helpers/firestore/users';
import { UserContext } from '../helpers/UserContext';
import { CircularProgress } from '@mui/material';
import { IUser, UserFullData, UserRoles } from '../shared/User';
import { ROUTES } from 'App';

const WithAuthentication = ({
  redirectUrl,
  roles,
  eventId
}: {
  redirectUrl?: string;
  roles?: UserRoles[];
  eventId?: string;
}) => {
  const auth = getAuth();
  // @ts-ignore
  // eslint-disable-next-line no-unused-vars
  const { user, setUser }: { user: IUser; setUser: (data: IUser) => {} } = useContext(UserContext);
  const [ran, setRan] = useState(false);
  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        const userData = (await getUser(user.uid)) as UserFullData;
        setUser({ ...user, data: userData });
      }
      setRan(true);
    });

    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, [auth]);

  const unverified = ran && (!user || !user?.emailVerified);
  const hasRequiredRole = () => {
    const userRoles = user?.data?.roles;
    const isSuperAdmin = !!userRoles?.[UserRoles.SUPER_ADMIN];
    const isAdminOfThisEvent = !eventId || user?.data?.adminOf?.find((e) => e === eventId);
    if (!roles?.length || isSuperAdmin) {
      return true;
    } else {
      return isAdminOfThisEvent;
    }
  };

  return (
    <>
      {!ran && <CircularProgress />}
      {ran && (unverified || !hasRequiredRole()) && (
        // eslint-disable-next-line react/prop-types
        <Navigate to={ROUTES.SIGN_IN} replace state={{ redirectUrl: redirectUrl }} />
      )}
    </>
  );
};
export default WithAuthentication;
