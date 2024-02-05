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
import Typography from '@mui/material/Typography';


const GeneralInfo = ({ idNewEventCreate } : {idNewEventCreate: string}) => {
  const [events, setEvents] = useState<EtiEvent[]>([]);
  const [eventos, setEventos] = useState<EtiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [eventData, setEventData] = useState<EtiEvent| null> (null);
  const [changeEvent2, setChangeEvent2] = useState(false)
  const [changeEvent3, setChangeEvent3] = useState(false)
  // const [showEvent, setShowEven] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  

  useEffect(() => {
    const fetchData = async () => {
      const evts = await firestoreEventHelper.getEvents();
      setEvents(evts);
      if (evts.length > 0) {
        const eventosOrdenados = evts.sort((a:any, b:any) => b.dateStart - a.dateStart);
        const ultimoEvento = eventosOrdenados[0];
        const eventoSeleccionado = evts.find(element => element.id === idNewEventCreate) || ultimoEvento;
        setEventData(eventoSeleccionado);
        setSelectedRows([eventoSeleccionado.id])
        //console.log("La bestia", ultimoEvento)
      } else {
        setEventData(null);
      }
    };
    setIsLoading(true);
    fetchData().catch((error) => console.error(error));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const evts = await firestoreEventHelper.getEvents();
      setEvents(evts);
      if (evts.length > 0) {
        evts.forEach((element) => {
          if(element.id === eventData?.id){
            setEventData(element)
          }
        })
        setChangeEvent3(false)
      } else {
        setEventData(null);
      }
    };
    setIsLoading(true);
    fetchData().catch((error) => console.error(error));
    setIsLoading(false);
  }, [changeEvent2, changeEvent3]);

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
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
          {events.length > 0 ? (
            <>
            <NewEventList events={events} isLoading={isLoading} onDeleteEvent={handleDeleteEvent} onSelectEvent={setEventData} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
            <Box sx={{mt: 5}}>
              <NewEditEvent selectedEvent={eventData} setChangeEvent2={setChangeEvent2} changeEvent2={changeEvent2} setChangeEvent3={setChangeEvent3}></NewEditEvent>
            </Box>
            </>
           ) : (
            <h1>
              No hay eventos creados
            </h1>
              )
          }

     </Box>
    </>
  );
};
export default GeneralInfo;