import { useEffect, useState } from 'react';
import WithAuthentication from '../../withAuthentication';
import { UserRoles } from 'shared/User';
import { EtiEvent } from 'shared/etiEvent';
import * as firestoreEventHelper from 'helpers/firestore/events';
import { createOrUpdateDoc } from 'helpers/firestore';

const EventsList = () => {
  // eslint-disable-next-line no-unused-vars
  const [events, setEvents] = useState<EtiEvent[]>([]);

  // eslint-disable-next-line no-unused-vars
  const updateEvent = (etiData: EtiEvent) => {
    return createOrUpdateDoc(firestoreEventHelper.EVENTS, etiData, etiData.id);
  };

  // eslint-disable-next-line no-unused-vars
  const createEvent = (data: EtiEvent) => {
    return createOrUpdateDoc(firestoreEventHelper.EVENTS, data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const evts = await firestoreEventHelper.getEvents();
      console.log(evts);
      setEvents(evts);
    };
    fetchData().catch((error) => console.error(error));
  }, []);

  return (
    <>
      <WithAuthentication roles={[UserRoles.SUPER_ADMIN]} />
      <>listar la variable events aca</>
    </>
  );
};
export default EventsList;
