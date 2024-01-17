/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, Grid, Box, Typography} from '@mui/material';
import { Form, Formik } from 'formik';
import { date, object, string } from 'yup';
import { createOrUpdateDoc  } from 'helpers/firestore';
import { EtiEvent } from '../../../shared/etiEvent';
import ETIAgenda from 'components/ETIAgenda.jsx';
import ETIAlojamiento from 'components/ETIAlojamiento.jsx';
import ETIDataBanks from 'components/ETIDataBanks.jsx';
import ETIMercadoPago from 'components/ETIMercadoPago.jsx';
import ETICombos from 'components/ETICombo';
import ETIEventDate from 'components/ETIEventDates';


export default function NewEditEvent({ selectedEvent, changeEvent2 }: { selectedEvent: EtiEvent | null, changeEvent2 : Function }) {

  const alertText: string = 'Este campo no puede estar vacío';
  const EventFormSchema = object({
    dateEnd: date().required(alertText),
    dateSignupOpen: date().required(alertText),
    dateStart: date().required(alertText),
    location: string().required(alertText),
    name: string().required(alertText),
    country: string().nullable(true).required(alertText),
    province: string()
      .nullable(true)
      .when('country', {
        is: 'Argentina',
        then: string().nullable(true).required(alertText)
      }),
    city: string()
      .nullable(true)
      .when('country', {
        is: 'Argentina',
        then: string().nullable(true).required(alertText)
      }),
  });
  const idEvent = selectedEvent?.id
  const [alojamientoData, setAlojamientoData] = useState([null]);
  const [dataBanks, setDataBanks] = useState([null])
  const [dataMP, setDataMP] = useState([null])

  const updateAlojamientoData = (newData) => {
    setAlojamientoData(newData);
    //console.log('data de alojamiento -> ', alojamientoData);
  };

  const updateDataBanks = (newData) => {
    setDataBanks(newData);
    //console.log('data bancaria -> ', dataBanks);
  }

  const updateDataMP = (newData) => {
    setDataMP(newData);
    //console.log('data MP -> ', dataMP);
  }

  useEffect(()=>{
    console.log('selected event Cambio', selectedEvent);
    
  },[selectedEvent])

  const handleCreateEvent = async (values: any) => {
    try {
      if(!changeEvent2){
      values.alojamiento = alojamientoData;
      values.datosBancarios = dataBanks;
      values.linkMercadoPago = dataMP;  
        await createOrUpdateDoc('events', values, idEvent === 'new' ? undefined : idEvent);
      } else {
        alert('Tienes cambios que no seran guardados.')
      }
    } catch (error) {
      console.error(error);
    }
  };

  const scrollbarStyles = {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#C0E5FF',
      borderRadius: '12px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
      boxShadow: '1px 0px 2px 0px #6695B7',
      borderRadius: '12px',
    },
  };


  return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto', width: '960px', height: '1746px', boxShadow: 3, borderRadius: '12px', backgroundColor: '#FFFFFF' }}>
              <Box sx={{ display: 'flex', ...scrollbarStyles, flexDirection: 'column' }}>
                  <Box sx={{width: '100%'}}>
                <ETIEventDate selectedEvent={selectedEvent} changeEvent={changeEvent2} />
                  </Box>
                <Grid container >
                  <Formik
                    enableReinitialize
                    initialValues={{
                      // dateEnd: selectedEvent?.dateEnd || '',
                      // dateSignupOpen: selectedEvent?.dateSignupOpen || '',
                      // dateStart: selectedEvent?.dateStart || '',
                      // name: selectedEvent?.name || '',
                      // country: selectedEvent?.country || '',
                      // province: selectedEvent?.province || '',
                      // city: selectedEvent?.city || '',
                      // admins: selectedEvent?.admins || '',
                      // timeStart: selectedEvent?.timeStart || '',
                      // timeEnd: selectedEvent?.timeEnd || '',
                      // timeSignupOpen: selectedEvent?.timeSignupOpen || '',
                      // timeSignupEnd: selectedEvent?.timeSignupEnd || '',
                      // timeStart: selectedEvent?.timeStart || '',
                      // timeEnd: selectedEvent?.timeEnd || '',
                      // timeSignupOpen: selectedEvent?.timeSignupOpen || '',
                      // timeSignupEnd: selectedEvent?.timeSignupEnd || '',
                      alojamiento: selectedEvent?.alojamiento || null,
                      datosBancarios: selectedEvent?.datosBancarios || null,
                      linkMercadoPago: selectedEvent?.linkMercadoPago || null
                    }}
                    validationSchema={EventFormSchema}
                    onSubmit={async (values) => {
                      console.log('values en save aqui ', values);
                    }}
                  >
                    {({ setFieldValue, values }) => (
                      <Form>
              
                        <Box sx={{ margin: '0px 20px 0px 20px', backgroundColor: '#FAFAFA', borderRadius: '0px 0px 12px 12px', p: 2 }}>
                          <Grid container spacing={2}>
                        
                          
                          <Grid item md={12} sm={12} xs={12}>
                            <ETIAgenda idEvent={idEvent} eventData={selectedEvent} />
                          </Grid> 
                          

                          <Grid item md={12} sm={12} xs={12}>
                            <ETIAlojamiento idEvent={idEvent} event={selectedEvent} updateAlojamientoData={updateAlojamientoData} />
                          </Grid>

                          <Grid item md={12} sm={12} xs={12}>
                            <ETIDataBanks idEvent={idEvent} event={selectedEvent} dataBanks={updateDataBanks}/>
                          </Grid> 

                          <Grid item md={12} sm={12} xs={12}>
                            <ETIMercadoPago idEvent={idEvent} event={selectedEvent} dataMP={updateDataMP}/>
                          </Grid>

                          <Grid item md={12} sm={12} xs={12}>
                            <ETICombos setFieldValue={setFieldValue} values={values} selectedEvent={selectedEvent}/>
                          </Grid>

                          <Grid item md={12} sm={12} xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button type='submit' sx={{ width: '115px', padding: '12px, 32px, 12px, 32px', borderRadius: '25px', backgroundColor: '#A82548', height: '44px', '&:hover': { backgroundColor: '#A82548' } }} onClick={() => {handleCreateEvent(values)}}>
                              <Typography sx={{ color: '#FAFAFA', fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}>
                                Guardar
                              </Typography>
                            </Button>
                          </Box>
                          </Grid>


                        </Grid>
                        </Box>
                      </Form>
                    )}
                  </Formik>
                </Grid>
              </Box>
            </Box>
        </>
  );
}

