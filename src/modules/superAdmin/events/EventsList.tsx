import React, { useEffect, useState } from 'react';
import WithAuthentication from '../../withAuthentication';
import { UserRoles } from 'shared/User';
import { EtiEvent } from 'shared/etiEvent';
import * as firestoreEventHelper from 'helpers/firestore/events';
import EventListTable from './eventsListTable';

const EventsList = () => {
  // eslint-disable-next-line no-unused-vars
  const [events, setEvents] = useState<EtiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars

  useEffect(() => {
    const fetchData = async () => {
      const evts = await firestoreEventHelper.getEvents();
      console.log(evts);
      setEvents(evts);
    };
    setIsLoading(true);
    fetchData().catch((error) => console.error(error));
    setIsLoading(false);
  }, []);

  return (
    <>
      <WithAuthentication roles={[UserRoles.SUPER_ADMIN]} />
      <EventListTable events={events} isLoading={isLoading} />
    </>
  );
};
export default EventsList;
