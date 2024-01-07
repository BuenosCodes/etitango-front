
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Container, Grid, Box, styled, Avatar, Typography, Modal, Icon, Chip } from '@mui/material';
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
import ETIAgenda from 'components/ETIAgenda.jsx';
import ETIAlojamiento from 'components/ETIAlojamiento.jsx';
import ETIDataBanks from 'components/ETIDataBanks.jsx';
import ETIMercadoPago from 'components/ETIMercadoPago.jsx';
import RolesNewEvent from '../roles/RolesNewEvent';


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

  const [event, setEvent] = useState<EtiEvent>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [users, setUsers] = useState<UserFullData[]>([]);
  const [usuarios, setUsuarios] = useState<UserFullData[]>([]);
  const [adminsData, setAdminsData] = useState<{ id: string; fullName: string }[]>([]);
  const [IsLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [hora, setHora] = useState<Date | null>(null)
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false)
  };
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const eventExists = await getDocument(`events/${id}`);
        if (eventExists) {
          const event = await getEvent(id);
  console.log('event aqui ->', event);

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
    console.log('eventid aqui en roles list', eventId);

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
      console.log('selectedEvent aqui ->',selectedEvent);
      
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

  const styleModal = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#FAFAFA',
    border: '1px solid #000',
    boxShadow: 24,
    borderRadius: 6,
    p: 4,
    overflow: 'auto',
    width: '900px',
    height: '500px',
  };

  const handleOpen = () => setOpen(true);
  const handleDelete = async () => {
    console.log('aprete aqui xd');

  };

  console.log(adminsData);

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
            <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto', width: '960px', height: '1000px', boxShadow: 3, borderRadius: '12px', backgroundColor: '#FFFFFF' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 8px 24px 0px', margin: '20px 20px 0px 20px' }}>
                <Typography sx={{ fontWeight: 600, fontSize: '24px', }}>Información general</Typography>

                <Box sx={{ display: 'flex', mr: 1, alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '24px', color: '#0075D9', mr: 1 }}>{selectedEvent?.name}</Typography>
                  <Button>
                    <Icon>
                      <img src={'/img/icon/Button_modify.svg'} height={25} width={25} />
                    </Icon>
                  </Button>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', margin: '20px', backgroundColor: '#FAFAFA', borderRadius: '12px', p: 2, ...scrollbarStyles, flexDirection: 'column' }}>
                <Grid container >
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
                    {({ setFieldValue, touched, errors, values }) => (
                      <Form>
                        <Grid container spacing={2}>

                          <Grid item xs={12}>
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

                          <Grid item md={12} sm={12} xs={12}>
                            <Grid container spacing={2}>
                              <Grid item md={4} sm={4} xs={4}>
                                <Typography style={{ fontFamily: 'inter', color: '#0075D9' }}>
                                  Desde
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E68650', borderRadius: 2 }}>
                                  <ETIDatePickerEdit
                                    textFieldProps={{ fullWidth: true }}
                                    fieldName="dateStart"
                                    setFieldValue={setFieldValue}
                                    borderColor={false}
                                    specialCase={true}
                                  />
                                  <Box sx={{ width: '100px', ml: 6 }}>
                                    <Typography style={{ fontFamily: 'inter', color: '#0075D9', fontSize: '16px' }}>
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

                              <Grid item md={4} sm={4} xs={4} >
                                <Typography style={{ fontFamily: 'inter', color: '#0075D9' }}>
                                  Hasta
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E68650', borderRadius: 2 }}>
                                  <ETIDatePickerEdit
                                    textFieldProps={{ fullWidth: true }}
                                    fieldName="dateEnd"
                                    setFieldValue={setFieldValue}
                                    borderColor={false}
                                    specialCase={true}
                                  />
                                  <Box sx={{ width: '100px', ml: 6 }}>
                                    <Typography style={{ fontFamily: 'inter', color: '#0075D9', fontSize: '16px' }}> a las</Typography>
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

                              <Grid item md={4} sm={4} xs={4} >
                                <Typography style={{ fontFamily: 'inter', color: '#0075D9' }}>
                                  Inscripciones
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E68650', borderRadius: 2 }}>
                                  <ETIDatePickerEdit
                                    textFieldProps={{ fullWidth: true }}
                                    fieldName="dateSignupOpen"
                                    setFieldValue={setFieldValue}
                                    borderColor={false}
                                    specialCase={true}
                                  />
                                  <Box sx={{ width: '100px', ml: 6 }}>
                                    <Typography style={{ fontFamily: 'inter', color: '#0075D9', fontSize: '16px' }}>a las</Typography>
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
                          </Grid>


                          <Grid item md={12} sm={12} xs={12}>
                            <Grid container gap={2} sx={{ border: '1.5px solid #E68650', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }} >
                              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                {adminsData.map((admin, index) => (
                                  <Chip key={index} label={admin.fullName} onDelete={() => handleDelete()} variant="outlined" sx={{ m: 1, borderRadius: '8px', color: '#A82548', fontFamily: 'Roboto', fontWeight: 500, fontSize: '14px' }} />
                                ))}
                              </Box>
                              <Button sx={{ padding: '12px, 16px, 12px, 16px', alignItems: 'flex-end' }} onClick={handleOpen}>
                                <Icon sx={{ display: 'flex', width: '4em' }}>
                                  <Typography sx={{ mr: 1, color: '#A82548', fontFamily: 'Roboto', fontWeight: 500 }}>
                                    Agregar
                                  </Typography>
                                  <img src='/img/icon/user-cirlce-add.svg' height={25} width={25} />
                                </Icon>
                              </Button>
                            </Grid>

                              <Modal open={open} onClose={() => handleClose()}>
                                  <Box sx={{ ...styleModal, display: 'flex', flexDirection: 'column' }}>
                                    <RolesNewEvent eventId={eventId} handleClose={handleClose} />
                                  </Box>
                            </Modal>
                          </Grid>
                        

                          <Grid item md={12} sm={12} xs={12}>
                            <ETIAgenda dateStart={undefined} name={undefined} additionalFields={undefined} />
                          </Grid>

                          <Grid item md={12} sm={12} xs={12}>
                            <ETIAlojamiento />
                          </Grid>

                          <Grid item md={12} sm={12} xs={12}>
                            <ETIMercadoPago />
                          </Grid>

                          <Grid item md={12} sm={12} xs={12}>
                            <ETIDataBanks />
                          </Grid>

                          <Grid item md={12} sm={12} xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button type="submit" sx={{ width: '115px', padding: '12px, 32px, 12px, 32px', borderRadius: '25px', backgroundColor: '#A82548', height: '44px', '&:hover': { backgroundColor: '#A82548' } }}>
                              <Typography sx={{ color: '#FAFAFA', fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}>
                                Guardar
                              </Typography>
                            </Button>
                          </Box>
                          </Grid>

                        </Grid>
                      </Form>
                    )}
                  </Formik>
                </Grid>
              </Box>
            </Box>
          )}
        </>
      )}
    </Translation>
  );
}

