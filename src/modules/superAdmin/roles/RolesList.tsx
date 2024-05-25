import React, { useEffect, useState } from 'react';
import WithAuthentication from '../../withAuthentication';
import { UserFullData, UserRoles } from 'shared/User';
import * as firestoreUserHelper from 'helpers/firestore/users';
import RolesListTable from './rolesListTable';
import { RolesAddForm } from './RolesAddForm';
import { Unsubscribe } from 'firebase/firestore';

const RolesList = ({ eventId }: { eventId?: string }) => {
  // eslint-disable-next-line no-unused-vars
  const [users, setUsers] = useState<UserFullData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars

  useEffect(() => {
    setIsLoading(true);

    let unsubscribe: Unsubscribe;

    const fetchData = async () => {
      unsubscribe = await firestoreUserHelper.getAdmins(setUsers, setIsLoading, eventId);
    };

    fetchData().catch((error) => {
      console.error(error);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [eventId]);

  return (
    <>
      <WithAuthentication roles={[UserRoles.SUPER_ADMIN]} />
      <RolesAddForm etiEventId={eventId} />
      <RolesListTable users={users} isLoading={isLoading} eventId={eventId} />
    </>
  );
};
export default RolesList;
