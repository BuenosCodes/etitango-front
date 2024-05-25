import { useNavigate } from 'react-router-dom';
import { resetSignup } from '../../helpers/firestore/signups';
import { ROUTES } from '../../App';
import { Button, Typography } from '@mui/material';
import React from 'react';

export function ResetSignup({ etiEventId, signupId }: { etiEventId: string; signupId: string }) {
  const navigate = useNavigate();
  const handleClick = async () => {
    await resetSignup(etiEventId, signupId);
    navigate(ROUTES.SIGNUPS);
  };
  return (
    <>
      <Typography>Tu inscripción está Cancelada</Typography>
      <Button onClick={handleClick} variant={'contained'} color={'secondary'}>
        <Typography>Reinscribirme</Typography>
      </Button>
    </>
  );
}
