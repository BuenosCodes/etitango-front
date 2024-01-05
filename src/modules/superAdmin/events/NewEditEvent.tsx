
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Container, Grid, Box, styled, Avatar, Typography, Modal} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Translation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { Field, Form, Formik } from 'formik';
import TextField from '@mui/material/TextField';
import { date, object, string } from 'yup';
import { createOrUpdateDoc, getDocument, updateEventWithImageUrl } from 'helpers/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../App.js';
import { getEvent } from '../../../helpers/firestore/events';
import { EtiEvent } from '../../../shared/etiEvent';
import { UserRoles, UserFullData } from '../../../shared/User';
import * as firestoreUserHelper from 'helpers/firestore/users';
import { LocationPicker } from 'components/form/LocationPicker';
import { ETIDatePickerEdit } from 'components/form/DatePickerEdit';
import { ETITimePickerEdit } from 'components/form/TimePickerEdit';

//import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";

const useStyles = makeStyles({
  interFont: {
    fontFamily: 'inter',
  },
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#E68650',
        borderRadius: '8px',
        borderWidth: '1,5px'   
      },
      '&:hover fieldset ': {
        borderColor: '#E68650',
        borderRadius: '8px',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#E68650',
        borderRadius: '8px',
      },
    },
  },
  icon: {
    width: '24px',
    height: '24px',
  },
});

export default function NewEditEvent({ eventId, selectedEvent }: { eventId?: string, selectedEvent: EtiEvent | null }) {
  
  const classes = useStyles()
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

  const [event, setEvent] = useState<EtiEvent> ();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [users, setUsers] = useState<UserFullData[]>([]);
  const [usuarios, setUsuarios] = useState<UserFullData[]>([]);
  const [adminsData, setAdminsData] = useState<{ id: string; fullName: string }[]>([]);
  const [IsLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [hora, setHora] = useState<Date | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const eventExists = await getDocument(`events/${id}`);
        if (eventExists) {
          const event = await getEvent(id);
          setEvent(event);
          }
        } else {
          console.log("hola")
          // navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
        }
        setLoading(false);
      
    };
    fetchData().catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    setIsLoading(true);

    let unsubscribe: Function;
    let usuarios2: Function;
    console.log('eventid aqui en roles list',eventId);
    
    const fetchData = async () => {
      unsubscribe = await firestoreUserHelper.getAdmins(setUsers, setIsLoading, eventId);
      usuarios2 = await firestoreUserHelper.getAllUsers(setUsuarios, setIsLoading)
      
    };

    fetchData().catch((error) => {
      console.error(error);
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      } if (usuarios2) {
        usuarios2()
      }
    };
  }, [eventId]);

  useEffect(() => {
    if (selectedEvent && selectedEvent.admins && users.length > 0) {
      const adminsArray: { id: string; fullName: string }[] = [];
      selectedEvent.admins.forEach((element: string) => {
        users.forEach((user) => {
          if (element === user.id) {
            adminsArray.push({
              id: user.id,
              fullName: `${user.nameFirst} ${user.nameLast}`,
            })
          }
        });
      });
      setAdminsData(adminsArray)
    }
  }, [selectedEvent, users]); 

  

  // useEffect(() => {
  //   setEvent(selectedEvent);
  // }, [selectedEvent]);


  const save = async (values: any, setSubmitting: Function) => {
    try {
      const eventId = await createOrUpdateDoc('events', values, id === 'new' ? undefined : id);
      navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };


  
  return (
    <Translation
      ns={[SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP, SCOPES.MODULES.PROFILE]}
      useSuspense={false}
    >
      {(t) => (
        <>
          
          {loading ? (
            <CircularProgress />
          ) : (
            <Container sx={{ marginTop: 3, width: '980px' }}>
              <Grid
                container
                
                // direction="column"
                // alignItems="center"
                // justifyContent="center"

              >
                

                <Formik
                  enableReinitialize
                  initialValues={{
                    dateEnd: selectedEvent?.dateEnd || '',
                    dateSignupOpen: selectedEvent?.dateSignupOpen || '',
                    dateStart: selectedEvent?.dateStart || '',
                    nombre: selectedEvent?.name || '',
                    country: selectedEvent?.country || '',
                    province: selectedEvent?.province || '',
                    city: selectedEvent?.city || '',
                    admins: selectedEvent?.admins || '',
                    timeStart: selectedEvent?.timeStart || '',
                    timeEnd: selectedEvent?.timeEnd || '',
                    timeSignupOpen: selectedEvent?.timeSignupOpen || '',
                    timeSignupEnd: selectedEvent?.timeSignupEnd || '',

                  }}
                  validationSchema={EventFormSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    await save(values, setSubmitting);
                  }}
                >
                  {({ isSubmitting, setFieldValue, touched, errors, values }) => (
                    <Form>
                      <Grid container spacing={2}>
                      {/* <Grid item md={12} sm={12} xs={12}>
                      <Typography pl={1.4} style={{fontFamily: 'inter', color: '#0075D9'}}>
                            Nombre del evento
                          </Typography>
                          <Field
                            name="nombre"
                            component={TextField}
                            value={values.nombre}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setFieldValue("nombre", e.target.value)
                            }
                            classes={{root: classes.root}}
                            InputProps={{ classes: { input: classes.interFont } }}
                            required
                            fullWidth
                          />
                        </Grid> */}

                       

                        <Grid item xs={12} lg={12} style={{ display: 'flex' }}>
                        
                          <LocationPicker
                            values={values}
                            errors={errors}
                            t={t}
                            setFieldValue={setFieldValue}
                            touched={touched}
                            location={event}
                            borderColor={false}
                            specialCase={true}
                            colorFont={'#0075D9'}
                            fontFamily={'Inter'}
                            fontWeight={400}
                          />
                        </Grid>
                        

                        <Grid
                        container
                        mt={2}
                        paddingLeft={'15px'}
                        direction={'row'}
                        >

                        
                        <Grid item xs={4} >
                        <Typography style={{fontFamily: 'inter', color: '#0075D9'}}>
                            Desde
                          </Typography>



                          <Box sx={{display:'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E68650', borderRadius: 2, width: '288px'}}>

                          <ETIDatePickerEdit
                                    textFieldProps={{ fullWidth: true }}
                                    fieldName="dateStart"
                                    setFieldValue={setFieldValue}
                                    borderColor={false}
                                    specialCase={true}
                                    />
                              <Box
                              sx={{width: '100px', ml: 6}}> 
                              <Typography  style={{fontFamily: 'inter', color: '#0075D9', fontSize: '16px'}}>
                                        a las  
                                </Typography>
                             </Box>

                            <ETITimePickerEdit
                                    textFieldProps={{ fullWidth: true }}
                                    fieldName="timeStart"
                                    setFieldValue={setFieldValue}
                                    borderColor={false}
                                    specialCase={true}
                                  />
                                  </Box>
                        </Grid>


                        <Grid item xs={4} >
                        <Typography ml= {1.5} style={{fontFamily: 'inter', color: '#0075D9'}}>
                            Hasta
                          </Typography>

                          <Box sx={{display:'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E68650', borderRadius: 2, width: '288px', ml: 1.5}}>

                          <ETIDatePickerEdit
                                    textFieldProps={{ fullWidth: true }}
                                    fieldName="dateEnd"
                                    setFieldValue={setFieldValue}
                                    borderColor={false}
                                    specialCase={true}
                                    />
                              <Box
                              sx={{width: '100px', ml: 6}}> 
                              <Typography  style={{fontFamily: 'inter', color: '#0075D9', fontSize: '16px'}}>
                                        a las  
                                </Typography>
                             </Box>

                            <ETITimePickerEdit
                                    textFieldProps={{ fullWidth: true }}
                                    fieldName="timeEnd"
                                    setFieldValue={setFieldValue}
                                    borderColor={false}
                                    specialCase={true}
                                  />
                                  </Box>


                        </Grid>

                        <Grid item xs={4} >
                        <Typography ml={2.7} style={{fontFamily: 'inter', color: '#0075D9'}}>
                            Inscripciones
                          </Typography>

                          <Box sx={{display:'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E68650', borderRadius: 2, width: '288px', ml: 2.7}}>

                          <ETIDatePickerEdit
                                    textFieldProps={{ fullWidth: true }}
                                    fieldName="dateSignupOpen"
                                    setFieldValue={setFieldValue}
                                    borderColor={false}
                                    specialCase={true}
                                    />
                              <Box
                              sx={{width: '100px', ml: 6}}> 
                              <Typography  style={{fontFamily: 'inter', color: '#0075D9', fontSize: '16px'}}>
                                        a las  
                                </Typography>
                             </Box>

                            <ETITimePickerEdit
                                    textFieldProps={{ fullWidth: true }}
                                    fieldName="timeSignupOpen"
                                    setFieldValue={setFieldValue}
                                    borderColor={false}
                                    specialCase={true}
                                  />
                                  </Box>
                        </Grid>

                        

                        </Grid>
            
                        


                        <Grid item md={12} sm={12} xs={12}>
                        <Typography style={{fontFamily: 'inter', color: '#0075D9'}}>
                        
                        Organizadores
                        </Typography>
                            
                            {adminsData.map((admin, index) => (
                              // <Typography> 

                              //   con
                              // </Typography>
                              <TextField
                                key={index}
                                value={admin.fullName}
                                classes={{ root: classes.root}}
                                inputProps={{
                                  style: {
                                    fontFamily: 'inter',
                                  },
                                }}
                                
                          />
                          ))}
                        </Grid>


                        {/* <Typography>{JSON.stringify(selectedEvent)}</Typography> */}
                       
                        {/* <Grid container justifyContent="flex-end">
                          <Grid item>
                            <Button
                              variant="contained"
                              color="secondary"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              Guardar
                            </Button>
                          </Grid>

                        </Grid>

                        <Grid container justifyContent="flex-end">
                          <Grid item>
                            <Button
                              type="submit"
                              onClick={() => console.log(values)}
                            >
                              Prueba 
                            </Button>
                          </Grid>

                        </Grid> */}

                        
                        

                      </Grid>
                    </Form>
                  )}
                </Formik>

               
              </Grid>  
            </Container>
          )}
        </>
      )}
    </Translation>
  );
}

