import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Container, Grid, Box, styled, Avatar, Typography, Modal} from '@mui/material';
import { makeStyles } from '@mui/styles';
import WithAuthentication from '../../withAuthentication';
import { Translation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { Field, Form, Formik } from 'formik';
import { DatePicker, DateTimePicker } from 'formik-mui-x-date-pickers';
import TextField from '@mui/material/TextField';
import { date, object, string } from 'yup';
import { createOrUpdateDoc, getDocument, updateEventWithImageUrl } from 'helpers/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../App.js';
import { getEvent } from '../../../helpers/firestore/events';
import { EtiEvent } from '../../../shared/etiEvent';
import { UserRoles, UserFullData } from '../../../shared/User';
import { getUser } from 'helpers/firestore/users';
import { ETIDatePicker } from '../../../components/form/DatePicker';
import { LocationPicker } from 'components/form/LocationPicker';

import * as firestoreUserHelper from 'helpers/firestore/users';
import { forEach } from 'lodash';

//import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
const useStyles = makeStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#E68650',
        borderRadius: '8px',
        borderWidth: '2px'   
      },
      '&:hover fieldset ': {
        borderColor: '#E68650',
        borderRadius: '8px',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#E68650',
        borderRadius: '8px',
      } 
    },
  },
  icon: {
    width: '24px',
    height: '24px',
  },
});

export default function EditEvent({ eventId }: { eventId?: string }) {
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
  const [usuarios, setUsuarios] = useState([]);
  // const [usuarioss, setUsuarioss] = useState<UserData | {}>({});
  const [IsLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const eventExists = await getDocument(`events/${id}`);
        if (eventExists) {
          const event = await getEvent(id);
          setEvent(event);
          
         
            // if (event.admins && event.admins.length > 0) {
            //   const usuarios = await firestoreUserHelper.getAllUsers(setUsuarioss, setIsLoading)
            //   usuarios.filter((usuario) => usuario.nameFirst && usuario.nameLast)


              //   const fetchData = async () => {
                 
              //     const user = await firestoreUserHelper.getUser(id);
              //     if (user) setUsuarioss(usuarioss)
              //     console.log(usuarioss)
              //   };
              //   fetchData().catch((error) => console.error(error));
              // }

            //   try {
            //     const usersData = await Promise.all(
            //       event.admins.map(adminId => firestoreUserHelper.getUser(adminId))
            //     );
            //     setUsuarioss(usersData);
                
            //   } catch (error) {
            //     console.error("Error fetching admin users:", error);
                
            //   }
            // }
            //   // Obtener la información de los usuarios de manera asíncrona
            //   const usersPromises = event.admins.map(async adminId => {
            //     return await firestoreUserHelper.getUser(adminId);
            //   });
    
            //   // Esperar a que todas las consultas se completen
            //   const usersData = await Promise.all(usersPromises);
            //   setUsuarioss(usersData);
            // }
            // event.admins.map(async id => {
            //   const usuarioss = await firestoreUserHelper.getUser(id)
            // })
            // setUsuarioss(usuarioss)
            
          }
          
          
        } else {
          navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
        }
        setLoading(false);
      
    };
    fetchData().catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, [id]);

  // useEffect(() => {

    
  //   const fetchData = async () => {
  //    const ussers = await firestoreUserHelper.getUser(id)
    
    
  //   setIsLoading(true);
  //   let unsubscribe: Function;
  //   let usuarios2: Function;
  //   console.log('eventid aqui en roles list',eventId);

  //   const fetchData = async () => {
  //     unsubscribe = await firestoreUserHelper.getAdmins(setUsers, setIsLoading, eventId);
  //     usuarios2 = await firestoreUserHelper.getAllUsers(setUsuarios, setIsLoading)
      
  //   };

  //   fetchData().catch((error) => {
  //     console.error(error);
  //   });
  //   return () => {
  //     if (unsubscribe) {
  //       unsubscribe();
        
  //     } if (usuarios2) {
  //       usuarios2()
  //     }
      
  //   };
  // }, [eventId]);


  const save = async (values: any, setSubmitting: Function) => {
    try {
      const eventId = await createOrUpdateDoc('events', values, id === 'new' ? undefined : id);
      navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      //TODO global error handling this.setState({errors: error.response.event})
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
            <Container maxWidth="lg" sx={{ marginTop: 3, mx: 3 }}>
              <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={3}
                mb={40}
                ml={40}
              >
                <Grid item xs = {12} sx={{ my: 3, typography: 'h4', color: 'black' }}>
                  Informacion General
                </Grid>

                <Formik
                  enableReinitialize
                  initialValues={{
                    dateEnd: event?.dateEnd || '',
                    dateSignupOpen: event?.dateSignupOpen || '',
                    dateStart: event?.dateStart || '',
                    name: event?.name || '',
                    location: event?.location || '',
                    country: event?.country || '',
                    province: event?.province || '',
                    city: event?.city || ''
                    
                    
                  }}
                  validationSchema={EventFormSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    await save(values, setSubmitting);
                  }}
                >
                  {({ isSubmitting, setFieldValue, touched, errors, values }) => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid  item md={6} sm={6} xs={12}>
                          <Typography pl={1.4} style={{fontFamily: 'inter', color: '#0075D9'}}>
                            Nombre del evento
                          </Typography>
                          <Field
                            name="name"
                            component={TextField}
                            required
                            fullWidth
                            classes={{root: classes.root}}
                            inputProps={{
                              style: {
                                fontFamily: 'Inter', 
                              }
                              
                              
                            }} />
                       

                           {/* <Box 
                           border={1} borderColor={'red'}
                          //  sx={{display:'flex' , direction: 'column', flexDirection:'flex-end', alignItems: 'center'}}
                           >
                                  <Avatar
                                      src="/img/icon/location.svg"
                                      alt="ETI"
                                      className={classes.icon}
                                      
                                  />
                           </Box> */}

                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                        <Typography pl={1.4} style={{fontFamily: 'inter', color: '#0075D9'}}>
                            Lugar del evento           
                        </Typography>
                            <Field
                            name="location"
                            component={TextField}
                            required
                            fullWidth
                            classes={{root: classes.root}}
                            inputProps={{
                              style: {
                                fontFamily: 'inter',

                              },
                            }}
                            

                          />
                        </Grid>

                        <Grid item xs={12} lg={12} style={{ display: 'flex' }}>
                        
                          <LocationPicker
                            values={values}
                            errors={errors}
                            t={t}
                            setFieldValue={setFieldValue}
                            touched={touched}
                            location={event}

                          />
                        </Grid>
                        <Grid item md={4} sm={4} xs={12}>
                        <Typography pl={1.4} style={{fontFamily: 'inter', color: '#0075D9'}}>
                            Desde
                          </Typography>
                          <ETIDatePicker
                            textFieldProps={{ fullWidth: true }}
                            fieldName="dateStart"
                            setFieldValue={setFieldValue}
                            

                          />
                        </Grid>

                        <Grid item md={4} sm={4} xs={12}>
                        <Typography pl={1.4} style={{fontFamily: 'inter', color: '#0075D9'}}>
                            Hasta            
                        </Typography>
                          <ETIDatePicker
                            textFieldProps={{ fullWidth: true }}
                            fieldName="dateEnd"
                            setFieldValue={setFieldValue}
                          />
                        </Grid>

                        <Grid item md={4} sm={4} xs={12}>
                        <Typography pl={1.4} style={{fontFamily: 'inter', color: '#0075D9'}}>
                            Inscripciones            
                        </Typography>

                          <ETIDatePicker
                            textFieldProps={{ fullWidth: true }}
                            fieldName="dateSignupOpen"
                            setFieldValue={setFieldValue}
                          />
                        </Grid>
                        
                        <Grid container justifyContent="flex-end">
                          <Grid item>
                            <Button
                              variant="contained"
                              color="secondary"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              Save
                            </Button>
                          </Grid>

                        </Grid>
                       

                     
                      </Grid>
                    </Form>
                  )}
                </Formik>

                <Grid item md={12} sm={12} xs={12}>
                        <Typography pl={1.4} style={{fontFamily: 'inter', color: '#0075D9'}}>
                        {/* {usuarioss.length > 0 ? `${usuarioss[0].nameLast} ${usuarioss[0].nameFirst}` : ''} */}
                        Organizadores
                        </Typography>
                            <TextField
                            classes={{root: classes.root}}
                            inputProps={{
                              style: {
                                fontFamily: 'inter',

                              },
                            }}
                            defaultValue={'Hola'}
                            

                          />
                        </Grid>
              </Grid>  
            </Container>
          )}
        </>
      )}
    </Translation>
  );
}
