import WithAuthentication from '../withAuthentication';
import { createSeeds } from '../../helpers/firestore/signups';
import { Button } from '@mui/material';
import { UserRoles } from '../../shared/User';

const SuperAdmin = () => {
  return (
    <>
      <WithAuthentication roles={[UserRoles.SUPER_ADMIN]} />
      <>
        <Button onClick={createSeeds}>Crear templates</Button>
      </>
    </>
  );
};
export default SuperAdmin;
