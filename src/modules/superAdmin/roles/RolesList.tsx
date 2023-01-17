import React, { useEffect, useState } from 'react';
import WithAuthentication from '../../withAuthentication';
import { UserFullData, UserRoles } from 'shared/User';
import * as firestoreUserHelper from 'helpers/firestore/users';
import { removeRole } from 'helpers/firestore/users';
import RolesListTable from './rolesListTable';
import { RolesAddForm } from './RolesAddForm';

const RolesList = () => {
  // eslint-disable-next-line no-unused-vars
  const [users, setUsers] = useState<UserFullData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars

  useEffect(() => {
    const fetchData = async () => {
      const users = await firestoreUserHelper.getAdmins();
      console.log(users);
      setUsers(users);
    };
    setIsLoading(true);
    fetchData().catch((error) => console.error(error));
    setIsLoading(false);
  }, []);

  async function removeARole(role: UserRoles, id: string) {
    await removeRole(id, role);
  }

  return (
    <>
      <WithAuthentication roles={[UserRoles.SUPER_ADMIN]} />
      <RolesAddForm />
      <RolesListTable users={users} isLoading={isLoading} removeARole={removeARole} />
    </>
  );
};
export default RolesList;
