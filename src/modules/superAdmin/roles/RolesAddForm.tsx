/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  assignEventAdmin,
  assignSuperAdmin,
  removeSuperAdmin,
  unassignEventAdmin
} from '../../../helpers/firestore/users';
import { Button, TextField } from '@mui/material';

export const RolesAddForm = ({ etiEventId }: { etiEventId?: string }) => {
  const [email, setEmail] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  return (
    <div>
      <TextField value={email} onChange={handleChange} />
      <strong>
        {etiEventId ? (
          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => assignEventAdmin(email, etiEventId)}
          >
            Make Admin
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => assignSuperAdmin(email)}
          >
            Make Super Admin
          </Button>
        )}
        {etiEventId ? (
          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => unassignEventAdmin(email, etiEventId)}
          >
            Remove Admin
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => removeSuperAdmin(email)}
          >
            Remove Super Admin
          </Button>
        )}
      </strong>
    </div>
  );
};
