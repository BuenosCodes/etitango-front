/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import WithAuthentication from '../../withAuthentication';
import { UserRoles } from 'shared/User';
import { EtiEvent } from 'shared/etiEvent';
import * as firestoreEventHelper from 'helpers/firestore/events';
import NewEventList from './NewEventList';
import NewEditEvent from './NewEditEvent';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from 'etiFirebase';
import { Box } from '@mui/material';


const GeneralInfo = () => {
  const [events, setEvents] = useState<EtiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [eventData, setEventData] = useState<EtiEvent| null> (null);
  // const [showEvent, setShowEven] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const evts = await firestoreEventHelper.getEvents();
      setEvents(evts);
    };
    setIsLoading(true);
    fetchData().catch((error) => console.error(error));
    setIsLoading(false);
  }, []);

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, "events", id));
      setIsLoading(true);
      const updatedEvents = await firestoreEventHelper.getEvents();
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <WithAuthentication roles={[UserRoles.SUPER_ADMIN]} />
      {/* <EventListTable events={events} isLoading={isLoading} /> */}
     <Box sx={{display: 'flex', flexDirection: 'column'}}>
      <NewEventList events={events} isLoading={isLoading} onDeleteEvent={handleDeleteEvent} onSelectEvent={setEventData}  />
      {eventData && (
        <Box sx={{mt: 5}}>
        <NewEditEvent selectedEvent={eventData}></NewEditEvent>
      </Box>
      )}
     </Box>
    </>
  );
};
export default GeneralInfo;
