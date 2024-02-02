/* eslint-disable prettier/prettier */
import WithAuthentication from '../withAuthentication';
import { upsertTemplates, fixNumbering, fixMailing } from '../../helpers/firestore/signups';
import { Button, Divider } from '@mui/material';
import { UserRoles } from '../../shared/User';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../App.js';
import { useEffect, useState } from 'react';
import { getEvents } from '../../helpers/firestore/events';

const SuperAdmin = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const ev = await getEvents();
      setEvents(ev);
    };
    fetch();
  }, []);

  return (
    <>
      <WithAuthentication roles={[UserRoles.SUPER_ADMIN]} />
      <>
        <Button onClick={upsertTemplates}>Actualizar email templates</Button>

        <Button onClick={() => navigate(ROUTES.SUPERADMIN + ROUTES.TEMPLATES)}>TEMPLATES</Button>
        <Button onClick={() => navigate(ROUTES.SUPERADMIN + ROUTES.EVENTS)}>EVENTS</Button>
        <Button onClick={() => navigate(ROUTES.SUPERADMIN + ROUTES.ROLES)}>ROLES</Button>
        <Divider />
        {events.map((e) => (
          <>
            <Button onClick={() => fixNumbering(e.id)} key={e.id}>
              Fix numbers on event {e.name}
            </Button>
            <Button onClick={() => fixMailing(e.id)} key={e.id}>
              Fix mailing on event {e.name}
            </Button>
          </>
        ))}
      </>
    </>
  );
};
export default SuperAdmin;
