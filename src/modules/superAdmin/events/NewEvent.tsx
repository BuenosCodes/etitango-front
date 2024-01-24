/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Grid, Box, Typography, Modal, Chip, Icon } from '@mui/material';
import WithAuthentication from '../../withAuthentication';
import { Translation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { date, object, string } from 'yup';
import { createOrUpdateDoc } from 'helpers/firestore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../App.js';
import { getEvent } from '../../../helpers/firestore/events';
import { EtiEvent } from '../../../shared/etiEvent';
import { UserRoles } from '../../../shared/User';
import { ETIDatePicker } from '../../../components/form/DatePicker';
import RolesNewEvent from '../roles/RolesNewEvent';
import { LocationPicker } from 'components/form/LocationPicker';
import { unassignEventAdmin } from '../../../helpers/firestore/users';
import { makeStyles } from '@mui/styles';
import ETITimePicker2 from 'components/ETITimePicker2';
import { ETITimePicker } from 'components/form/TimePicker';
import { assignEventAdmins } from '../../../helpers/firestore/users';

export default function NewEvent(props: { etiEventId: string, onChange: Function }) {
  const { etiEventId, onChange } = props
  const alertText: string = 'Este campo no puede estar vacío';


  const EventFormSchema = object({


    dateStart: date().nullable().transform((originalValue) => { const parsedDate = new Date(originalValue); return isNaN(parsedDate.getTime()) ? undefined : parsedDate; }).required(alertText),
    dateEnd: date().nullable().when('dateStart', (dateStart, schema) => (dateStart && schema.min(dateStart, "No puede ser anterior a la fecha de inicio"))).required(alertText),
    dateSignupOpen: date().nullable().when('dateStart', (dateStart, schema) => {
      if (dateStart) {
        const dateStartEqual = new Date(dateStart.getTime() - 1);
        return schema.max(dateStartEqual, "No puede ser igual o posterior a la fecha de inicio");
      }
      return schema;
    }).required(alertText),
    dateSignupEnd: date()
      .nullable()
      .when('dateStart', (dateStart, schema) => {
        if (dateStart) {
          const dateStartEqual = new Date(dateStart.getTime() - 1);
          return schema.max(dateStartEqual, "No puede ser igual o posterior a la fecha de inicio");
        }
        return schema;
      })
      .when('dateSignupOpen', (dateSignuopOpen, schema) => (dateSignuopOpen && schema.min(dateSignuopOpen, "No puede ser anterior a la fecha de inscripcion")))
      .required(alertText),
    timeStart: string().required(alertText),
    timeEnd: string().required(alertText),
    timeSignupOpen: string().required(alertText),
    timeSignupEnd: string().required(alertText),
    name: string().required(alertText),
    // country: string().nullable(true).required(alertText),
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
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  const [idNuevo, setIdNuevo] = useState('');
  const [enable, setEnable] = useState(false);
  const [open, setOpen] = React.useState(false);
  // const [createEvent, setCreateEvent] = useState(true);
  const [showAdmins, setShowAdmins] = useState(false)
  // const [selectAdmin, setSelectAdmin] = useState(false)
  const [admins, setAdmins] = useState<string[]>([]);
  const handleOpen = () => setOpen(true);
  const handleClose = (values: string[] | null) => {
    setOpen(false)
    // setCreateEvent(false)
    if (values && values.length > 0) {
      setAdmins((prevAdmins) => {
        const uniqueNewAdmins = values.filter((newAdmin: any) => !prevAdmins.some((admin: any) => admin.email === newAdmin.email));
        const combinedAdmins = [...prevAdmins, ...uniqueNewAdmins];
        const uniqueAdmins = combinedAdmins.filter((admin: any, index, self) => self.findIndex((a: any) => a.email === admin.email) === index);
        return uniqueAdmins;
      });

      setShowAdmins(true);
      console.log('Contenido de values:', values);
      console.log('Contenido de admins:', admins);
    }
  };


  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (etiEventId) {
  //       const isValidId: RegExp = /^new$|^[\w\d]{20}$/;

  //       if (etiEventId === "new" || isValidId.test(etiEventId)) {
  //         try {
  //           const event = await getEvent(etiEventId);
  //           setEvent(event);
  //           setLoading(false);
  //           console.log(JSON.stringify(event.city))
  //         } catch (error) {
  //           console.error(error);
  //         }
  //       } else {
  //         navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [etiEventId]);

  const save = async (values: any, setSubmitting: Function) => {
    try {
      if (etiEventId) {
        const validateRuote: RegExp = /^[a-zA-Z0-9]{20,}$/;
        const idV: boolean = validateRuote.test(etiEventId);
        const idEvento = await createOrUpdateDoc('events', values, etiEventId === 'new' ? undefined : idV);
        setIdNuevo(idEvento);
        setEnable(true)
        // navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
      }
    } catch (error) {
      console.error(error);
      setEnable(false)
      setSubmitting(false);
      //TODO global error handling this.setState({errors: error.response.event})
    }
  };


  const style = {
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


  const handleDelete = (email: string) => {
    try {
      // setAdmins((currentAdmins) => currentAdmins.filter((admin) => admin !== email));
      setAdmins((currentAdmins) => currentAdmins.filter((admin: any) => admin.email !== email));
    } catch (error) {
      console.error('Error al borrar administrador:', error);
    } finally {
      // setLoading(false);
    }
  };

  const handleCreateEvent = async (values: any, setSubmitting: Function) => {
    try {
      if (etiEventId) {
        const selectedEmails = admins.map((admin: any) => admin.email);
        // if (selectedEmails.length === 0) {
        //   if (admins.length === 0) {
        //     setSelectAdmin(true)
        //     throw new Error('Tienes que seleccionar al menos un admin.');
        //   }
        // }
        const validateRuote: RegExp = /^[a-zA-Z0-9]{20,}$/;
        const idV: boolean = validateRuote.test(etiEventId);
        const idEvento = await createOrUpdateDoc('events', values, etiEventId === 'new' ? undefined : idV);
        await assignEventAdmins(selectedEmails, idEvento);
        setIdNuevo(idEvento);
        setEnable(true)
        // setSelectAdmin(false)
        onChange(idEvento)
        // navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
      }
      // await createOrUpdateDoc('events', values, idNuevo === 'new' ? undefined : idNuevo);
    } catch (error) {
      console.error(error);
      setEnable(false)
      setSubmitting(false);
    }
  }

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

  const useStyles = makeStyles({
    root: {
      '& .MuiFormHelperText-root': {
        margin: '2px 0px 0px 2px'
      },
      '& .MuiOutlinedInput-root': {
        fontFamily: 'inter',
        '& fieldset': {
          borderRadius: '8px',
          borderWidth: '1.5px',
          pointerEvents: 'none'
        },
        '&:hover fieldset ': {
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '&.Mui-focused fieldset': {
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#FDE4AA',
        }
      },
    },
    filled: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#E68650',
        },
        '&:hover fieldset ': {
          borderColor: '#E68650',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#E68650',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#E68650',
        }
      },
    },
  });

  const classes = useStyles()


  return (
    <Translation
      ns={[SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP, SCOPES.MODULES.PROFILE]}
      useSuspense={false}
    >
      {(t) => (
        <>
          <WithAuthentication
            roles={[UserRoles.SUPER_ADMIN]}
            redirectUrl={`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`}
          />
          {loading ? (
            <CircularProgress />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', boxShadow: 3, width: 960, height: 820, borderRadius: '12px', overflow: 'auto', backgroundColor: '#FFFFFF' }}>
              <Box sx={{ color: '#FFFFFF', backgroundColor: '#4B84DB', padding: '12px 24px 12px 24px', fontWeight: 600, fontSize: '24px', lineHeight: '16px', fontFamily: 'Montserrat', height: '40px' }}>
                Nuevo ETI
              </Box>

              <Box sx={{ display: 'flex', ...scrollbarStyles }}>
                <Grid container>
                  <Grid item xs={12}>
                    <Formik
                      enableReinitialize
                      initialValues={{
                        dateEnd: event?.dateEnd || '',
                        dateSignupOpen: event?.dateSignupOpen || '',
                        dateStart: event?.dateStart || '',
                        dateSignupEnd: event?.dateSignupEnd || '',
                        timeStart: event?.timeStart || '',
                        timeEnd: event?.timeEnd || '',
                        timeSignupOpen: event?.timeSignupOpen || '',
                        timeSignupEnd: event?.timeSignupEnd || '',
                        location: event?.location || null,
                        name: event?.name || '',
                      }}
                      validationSchema={EventFormSchema}
                      onSubmit={async (values,  { setSubmitting }) => {
                        console.log('values aqui ->', values);
                        await handleCreateEvent(values, setSubmitting);
                      }}
                    >
                      {({ setFieldValue, touched, errors, values, isSubmitting}) => (
                        <Form>
                          <Box sx={{ margin: '20px', backgroundColor: '#FAFAFA', borderRadius: '12px', p: 2 }}>

                            <Grid container gap={2}>
                              <Typography sx={{ color: '#212121', fontWeight: 500 }}>Nombre para el evento</Typography>
                              <Grid item md={12} sm={12} xs={12}>
                                <Field
                                  name="name"
                                  placeholder="Nuevo ETI"
                                  component={TextField}
                                  required
                                  fullWidth
                                  classes={{ root: values.name ? classes.filled : classes.root }}
                                />
                              </Grid>

                              <Grid item md={12} sm={12} xs={12}>
                                <LocationPicker
                                  values={values}
                                  errors={errors}
                                  t={t}
                                  setFieldValue={setFieldValue}
                                  touched={touched}
                                  location={event}
                                  borderColor={enable}
                                  specialCase={false}
                                  colorFont={'#424242'}
                                  fontFamily={'Montserrat'}
                                  fontWeight={500}
                                  isDisabled={false}
                                />
                              </Grid>
                              {/* <Grid item md={12} sm={12} xs={12}>
                              <Field
                                name="location"
                                placeholder="Lugar"
                                component={TextField}
                                required
                                fullWidth
                                classes={{ root: classes.root }}
                              />
                            </Grid> */}
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={{ color: '#424242', fontWeight: 500 }}>Desde el</Typography>
                                <Grid container alignItems={'flex-start'}>
                                  <Grid item >
                                    <ETIDatePicker
                                      textFieldProps={{ fullWidth: true }}
                                      fieldName="dateStart"
                                      setFieldValue={setFieldValue}
                                      borderColor={enable}
                                      specialCase={false}
                                    />
                                  </Grid>
                                  <Typography sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}>a las</Typography>
                                  <Grid item >
                                    {/* <ETITimePicker
                                  textFieldProps={{ fullWidth: true }}
                                  fieldName="timeStart"
                                  setFieldValue={setFieldValue}
                                  borderColor={enable}
                                  specialCase={false}
                                /> */}
                                    <ETITimePicker2
                                      value={values['timeStart']}
                                      onChange={(value) => setFieldValue('timeStart', value)}
                                      isDisabled={false}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>

                              <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={{ color: '#424242', fontWeight: 500 }}>Hasta el</Typography>
                                <Grid container alignItems={'flex-start'}>
                                  <Grid item >
                                    <ETIDatePicker
                                      textFieldProps={{ fullWidth: true }}
                                      fieldName="dateEnd"
                                      setFieldValue={setFieldValue}
                                      borderColor={enable}
                                      specialCase={false}
                                    />
                                  </Grid>
                                  <Typography sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}>a las</Typography>
                                  <Grid item >
                                    {/* <ETITimePicker
                                  textFieldProps={{ fullWidth: true }}
                                  fieldName="timeEnd"
                                  setFieldValue={setFieldValue}
                                  borderColor={enable}
                                  specialCase={false}
                                /> */}
                                    <ETITimePicker2
                                      value={values['timeEnd']}
                                      onChange={(value) => setFieldValue('timeEnd', value)}
                                      isDisabled={false}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>

                              <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={{ color: '#424242', fontWeight: 500 }}>Inicio de inscripciones</Typography>
                                <Grid container alignItems={'flex-start'}>
                                  <Grid item >
                                    <ETIDatePicker
                                      textFieldProps={{ fullWidth: true }}
                                      fieldName="dateSignupOpen"
                                      setFieldValue={setFieldValue}
                                      borderColor={enable}
                                      specialCase={false}
                                    />
                                  </Grid>
                                  <Typography sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}>a las</Typography>
                                  <Grid item >
                                    {/* <ETITimePicker
                                  textFieldProps={{ fullWidth: true }}
                                  fieldName="timeSignupOpen"
                                  setFieldValue={setFieldValue}
                                  borderColor={enable}
                                  specialCase={false}
                                /> */}
                                    <ETITimePicker2
                                      value={values['timeSignupOpen']}
                                      onChange={(value) => setFieldValue('timeSignupOpen', value)}
                                      isDisabled={false}
                                    />
                                  </Grid>
                                  <Typography sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}>hasta el</Typography>
                                  <Grid item >
                                    <ETIDatePicker
                                      textFieldProps={{ fullWidth: true }}
                                      fieldName="dateSignupEnd"
                                      setFieldValue={setFieldValue}
                                      borderColor={enable}
                                      specialCase={false}
                                    />
                                  </Grid>
                                  <Typography sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}>hasta las</Typography>
                                  <Grid item >
                                    {/* <ETITimePicker
                                  textFieldProps={{ fullWidth: true }}
                                  fieldName="timeSignupEnd"
                                  setFieldValue={setFieldValue}
                                  borderColor={enable}
                                  specialCase={false}
                                /> */}
                                    <ETITimePicker2
                                      value={values['timeSignupEnd']}
                                      onChange={(value) => setFieldValue('timeSignupEnd', value)}
                                      isDisabled={false}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                              {/* <Grid container justifyContent="flex-end">
                              <Grid item>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  type="submit"
                                  disabled={enable}
                                  sx={{ width: '115px', padding: '12px, 32px, 12px, 32px', borderRadius: '25px', backgroundColor: enable ? '#CCCCCC' : '#A82548', height: '44px', '&:hover': { backgroundColor: enable ? '#CCCCCC' : '#A82548' } }}
                                >
                                  <Typography sx={{ color: '#FAFAFA', fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}>
                                    Continuar
                                  </Typography>
                                </Button>
                              </Grid>
                            </Grid> */}
                              {/* {idNuevo && (<> */}
                              <Grid item xs={12}>
                                <Grid container gap={2}>
                                  <Typography sx={{ color: '##424242', fontWeight: 500 }}>Colaboradores en la organización del evento</Typography>
                                  <Grid item xs={12} sx={{ border: admins.length ? '1.5px solid #E68650' :  '1.5px solid #FDE4AA', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                      {admins.length ? (<>
                                       {admins.map((admin: any, index) => (
                                          <Chip key={index} label={admin.name} onDelete={() => handleDelete(admin.email)} variant="outlined" sx={{ m: 1, borderRadius: '8px', color: '#A82548', fontFamily: 'Roboto', fontWeight: 500, fontSize: '14px' }} />
                                        ))}
                                      </>) : <Typography sx={{ display: 'flex', alignItems: 'center', ml: 1, color: '#9E9E9E', fontFamily: 'Roboto' }}> Organizadores </Typography>}
                                    </Box>
                                    <Button sx={{ padding: '12px, 16px, 12px, 16px', alignItems: 'flex-end' }} onClick={handleOpen}>
                                      <Icon sx={{ display: 'flex', width: '4em', mr: '-8px' }}>
                                        <Typography sx={{ mr: 1, color: '#A82548', fontFamily: 'Roboto', fontWeight: 500 }}>
                                          Agregar
                                        </Typography>
                                        <img src='/img/icon/user-cirlce-add.svg' height={25} width={25} />
                                      </Icon>
                                    </Button>

                                  </Grid>
                                </Grid>
                                <Modal open={open} onClose={() => handleClose([])}>
                                  <Box sx={{ ...style, display: 'flex', flexDirection: 'column' }}>
                                    <RolesNewEvent eventId={idNuevo} handleClose={handleClose} />
                                  </Box>
                                </Modal>




                              </Grid>


                              {/* </> */}
                              {/* )} */}
                            </Grid>
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: '20px' }}>
                            <Button type='submit'  disabled={isSubmitting} sx={{ width: '115px', padding: '12px, 32px, 12px, 32px', borderRadius: '25px', backgroundColor: '#A82548', height: '44px', '&:hover': { backgroundColor: '#A82548' } }}>
                              <Typography sx={{ color: '#FAFAFA', fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}>
                                Crear
                              </Typography>
                            </Button>
                          </Box>
                        </Form>
                      )}
                    </Formik>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </>
      )}
    </Translation>
  );
}
