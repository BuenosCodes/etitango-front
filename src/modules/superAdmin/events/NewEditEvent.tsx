/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Grid, Box, Typography} from '@mui/material';
import { Form, Formik } from 'formik';
import { date, object, string } from 'yup';
import { createOrUpdateDoc  } from 'helpers/firestore';
import { EtiEvent } from '../../../shared/etiEvent';
import { UserFullData } from '../../../shared/User';
import * as firestoreUserHelper from 'helpers/firestore/users';
import ETIAgenda from 'components/ETIAgenda.jsx';
import ETIAlojamiento from 'components/ETIAlojamiento.jsx';
import ETIDataBanks from 'components/ETIDataBanks.jsx';
import ETIMercadoPago from 'components/ETIMercadoPago.jsx';
import ETICombos from 'components/ETICombo';
import ETIEventDate from 'components/ETIEventDates';


export default function NewEditEvent({ selectedEvent, changeEvent2 }: { selectedEvent: EtiEvent | null, changeEvent2 : Function }) {

  // const classes = useStyles()
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
  // const [event, setEvent] = useState<EtiEvent>();
  const [loading, setLoading] = useState(false);
  const idEvent = selectedEvent?.id
  // const [users, setUsers] = useState<UserFullData[]>([]);
  // const [IsLoading, setIsLoading] = useState(true);
  // const [changeEvent, setChangeEvent] = useState(false)

  // useEffect(() => {
  //   setIsLoading(true);

  //   let unsubscribe: Function;
  //   let usuarios2: Function;
    
  //   const fetchData = async () => {
  //     unsubscribe = await firestoreUserHelper.getAdmins(setUsers, setIsLoading, idEvent);
  //     // usuarios2 = await firestoreUserHelper.getAllUsers(setUsuarios, setIsLoading)

  //   };

  //   fetchData().catch((error) => {
  //     console.error(error);
  //   });

  //   setLoading(false)
  //   return () => {
  //     if (unsubscribe) {
  //       unsubscribe();
  //     } if (usuarios2) {
  //       usuarios2()
  //     }
  //   };
  // }, [idEvent]);

  useEffect(()=>{
    console.log('selected event Cambio', selectedEvent);
    
  },[selectedEvent])

  const handleCreateEvent = async (values: any) => {
    try {
      console.log('changeEvent2', changeEvent2);
      
      if(!changeEvent2){
        await createOrUpdateDoc('events', values, idEvent === 'new' ? undefined : idEvent);
      } else {
        alert('Tienes cambios que no seran guardados.')
      }
      // navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
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

          {loading ? (
            <CircularProgress />
          ) : (
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
                              <ETIAgenda idEvent={idEvent} />
                            </Grid>


                            <Grid item md={12} sm={12} xs={12}>
                              <ETIAlojamiento idEvent={idEvent} />
                            </Grid>

                            <Grid item md={12} sm={12} xs={12}>
                              <ETIMercadoPago idEvent={idEvent} />
                            </Grid>

                            <Grid item md={12} sm={12} xs={12}>
                              <ETIDataBanks idEvent={idEvent} />
                            </Grid>

                            <Grid item md={12} sm={12} xs={12}>
                              <ETICombos setFieldValue={setFieldValue} selectedEvent={selectedEvent} />
                            </Grid>
                          </Grid>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: '20px'}}>
                          <Button type='submit' sx={{ width: '115px', padding: '12px, 32px, 12px, 32px', borderRadius: '25px', backgroundColor: '#A82548', height: '44px', '&:hover': { backgroundColor: '#A82548' } }} onClick={() => { handleCreateEvent(values) }}>
                            <Typography sx={{ color: '#FAFAFA', fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}>
                              Guardar
                            </Typography>
                          </Button>
                        </Box>

                      </Form>
                    )}
                  </Formik>
                </Grid>
              </Box>
            </Box>
          )}
        </>
  );
}

