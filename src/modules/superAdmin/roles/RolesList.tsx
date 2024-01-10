/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import WithAuthentication from '../../withAuthentication';
import { UserFullData, UserRoles } from 'shared/User';
import * as firestoreUserHelper from 'helpers/firestore/users';
import RolesListTable from './rolesListTable';
import { RolesAddForm } from './RolesAddForm';
// import { getUser } from '../../../helpers/firestore/users';


const RolesList = ({ eventId }: { eventId?: string }) => {
  // eslint-disable-next-line no-unused-vars
  const [users, setUsers] = useState<UserFullData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<UserFullData[]>([]);
  // eslint-disable-next-line no-unused-vars

  useEffect(() => {
    setIsLoading(true);

    let unsubscribe: Function;
    let usuarios2: Function;
    console.log('eventid aqui en roles list',eventId);

    const fetchData = async () => {
      unsubscribe = await firestoreUserHelper.getAdmins(setUsers, setIsLoading, eventId);
      usuarios2 = await firestoreUserHelper.getAllUsers(setUsuarios, setIsLoading)
    };

    fetchData().catch((error) => {
      console.error(error);
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      } if (usuarios2) {
        usuarios2()
      }
    };
  }, [eventId]);

  return (
    <>
      <WithAuthentication roles={[UserRoles.SUPER_ADMIN]} />
      <RolesAddForm etiEventId={eventId} />
      <RolesListTable users={usuarios} isLoading={isLoading} eventId={eventId} />
    </>
  );
};
export default RolesList;
