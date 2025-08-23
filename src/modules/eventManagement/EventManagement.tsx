import React, { useEffect, useState } from 'react';
import { EtiEvent } from '../../shared/etiEvent';
import { getEvents, updateEvent } from '../../helpers/firestore/events';
import { Button, Typography } from '@mui/material';

const EventManagement = () => {
  const [events, setEvents] = useState<EtiEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updatedEvent, setUpdatedEvent] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents();
        setEvents(fetchedEvents);
      } catch (err) {
        setError('Network error');
      }
    };
    fetchEvents();
  }, []);

  const handleUpdate = async (event: EtiEvent) => {
    try {
      await updateEvent(event);
      setUpdatedEvent('Updated Event');
    } catch (err) {
      setError('Failed to update event');
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
      {events.map((event) => (
        <div key={event.id}>
          <Typography>{event.name}</Typography>
          <Button onClick={() => handleUpdate(event)}>Update</Button>
        </div>
      ))}
      {updatedEvent && <Typography>{updatedEvent}</Typography>}
    </div>
  );
};

export default EventManagement; 