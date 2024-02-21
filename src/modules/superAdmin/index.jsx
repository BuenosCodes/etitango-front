import WithAuthentication from '../withAuthentication';
import { fixMailing, fixNumbering, upsertTemplates } from '../../helpers/firestore/signups';
import { Button, Divider, Paper, Typography } from '@mui/material';
import { UserRoles } from '../../shared/User';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../App.js';
import React, { useEffect, useState } from 'react';
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
          <Paper key={'event' + e.id}>
            <Typography>{e.name}</Typography>
            <Button onClick={() => fixNumbering(e.id)} key={e.id}>
              Fix numbers
            </Button>
            <Button onClick={() => fixMailing(e.id)} key={e.id}>
              Fix mailing
            </Button>
            <Button onClick={() => navigate(`${ROUTES.SUPERADMIN + ROUTES.SENT_MAILS}/${e.id}`)}>
              See mailing
            </Button>
          </Paper>
        ))}
      </>
    </>
  );
};
export default SuperAdmin;
