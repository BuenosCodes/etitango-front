import React, { useEffect, useState } from 'react';
import WithAuthentication from '../../withAuthentication';
import { UserRoles } from 'shared/User';
import { EtiEvent } from 'shared/etiEvent';
import * as firestoreEventHelper from 'helpers/firestore/events';
import EventListTable from './eventsListTable';
import { Button } from '@mui/material';
import { ROUTES } from '../../../App';
import { useNavigate } from 'react-router-dom';

const EventsList = () => {
  // eslint-disable-next-line no-unused-vars
  const [events, setEvents] = useState<EtiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars

  useEffect(() => {
    const fetchData = async () => {
      const evts = await firestoreEventHelper.getEvents();
      setEvents(evts);
    };
    setIsLoading(true);
    fetchData().catch((error) => console.error(error));
    setIsLoading(false);
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <WithAuthentication roles={[UserRoles.SUPER_ADMIN]} />
      <Button
        color="secondary"
        size="large"
        variant="contained"
        onClick={() => navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}/new`)}
      >
        Nuevo
      </Button>
      <EventListTable events={events} isLoading={isLoading} />
    </>
  );
};
export default EventsList;
