import WithAuthentication from '../withAuthentication';
import { createSeeds } from '../../helpers/firestore/signups';
import { Button } from '@mui/material';
import { UserRoles } from '../../shared/User';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../App.js';

const SuperAdmin = () => {
  const navigate = useNavigate();
  return (
    <>
      <WithAuthentication roles={[UserRoles.SUPER_ADMIN]} />
      <>
        <Button onClick={createSeeds}>Crear templates</Button>
        <Button onClick={() => navigate(ROUTES.SUPERADMIN + ROUTES.TEMPLATES)}>TEMPLATES</Button>
        <Button onClick={() => navigate(ROUTES.SUPERADMIN + ROUTES.EVENTS)}>EVENTS</Button>
        <Button onClick={() => navigate(ROUTES.SUPERADMIN + ROUTES.ROLES)}>ROLES</Button>
      </>
    </>
  );
};
export default SuperAdmin;
