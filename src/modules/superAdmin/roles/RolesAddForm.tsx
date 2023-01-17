import React, { useState } from 'react';
import { UserRoles } from '../../../shared/User';
import { addRole } from '../../../helpers/firestore/users';
import { Button, TextField } from '@mui/material';

export const RolesAddForm = () => {
  const [email, setEmail] = useState('');

  async function addARole(email: string, role: UserRoles) {
    await addRole(email, role);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  return (
    <div>
      <TextField value={email} onChange={handleChange} />
      <strong>
        <Button
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          onClick={() => addARole(email, UserRoles.ADMIN)}
        >
          Make Admin
        </Button>
        <Button
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          onClick={() => addARole(email, UserRoles.SUPER_ADMIN)}
        >
          Make Super Admin
        </Button>
      </strong>
    </div>
  );
};
