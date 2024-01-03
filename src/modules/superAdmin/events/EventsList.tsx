/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import WithAuthentication from '../../withAuthentication';
import { UserRoles } from 'shared/User';
import { EtiEvent } from 'shared/etiEvent';
import * as firestoreEventHelper from 'helpers/firestore/events';
import EventListTable from './eventsListTable';
import NewEventList from './NewEventList';
import NewEditEvent from './NewEditEvent';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from 'etiFirebase';
import { Box, Typography, Paper, Grid } from '@mui/material';



const EventsList = () => {
  const [events, setEvents] = useState<EtiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [eventData, setEventData] = useState<EtiEvent| null> (null);

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
      
      <Box
      
      justifyContent={'center'}
      >
      <NewEventList events={events} isLoading={isLoading} onDeleteEvent={handleDeleteEvent} onSelectEvent={setEventData}  />
      <Paper elevation={3}
      >
        <Grid
        container>

          <Grid item xs={6} md={6} sx={{mt: 5}}>
          <Typography sx={{fontWeight: 600, fontSize: '24px', pl: 4 }}>Información general</Typography>
          </Grid>


          <Grid item xs={6} md={6} sx={{display: 'flex', justifyContent: 'flex-end', mt: 5}}>
          <Typography sx={{fontFamily: 'inter', fontWeight: 600, fontSize: '24px', color: '#0075D9', pr: 4 }}>{eventData?.name}</Typography>
          </Grid>
        

        </Grid>
      
      <NewEditEvent selectedEvent={eventData}></NewEditEvent>
      
      </Paper>
      
      
      </Box>
      
      

    </>
  );
};
export default EventsList;
