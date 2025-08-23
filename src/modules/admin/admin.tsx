import React from 'react';
import WithAuthentication from '../withAuthentication';
import { UserRoles } from '../../shared/User';

const Admin = () => {
  return (
    <WithAuthentication roles={[UserRoles.ADMIN]}>
      <div data-testid="admin-page">Admin Page</div>
    </WithAuthentication>
  );
};

export default Admin; 