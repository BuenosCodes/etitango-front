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


export default function NewEvent(props: { etiEventId: string, onChange: Function }) {
  const { etiEventId, onChange } = props
  const alertText: string = 'Este campo no puede estar vacío';

  const EventFormSchema = object({

    dateStart: date().required(alertText),
    dateEnd: date().when('dateStart', (dateStart, schema) => (dateStart && schema.min(dateStart, "No puede ser menor a la fecha de inicio"))).required(alertText),
    dateSignupOpen: date().when('dateStart', (dateStart, schema) => (dateStart && schema.max(dateStart, "No puede ser mayor a la fecha de inicio"))).required(alertText),
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [idNuevo, setIdNuevo] = useState('');
  const [enable, setEnable] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [createEvent, setCreateEvent] = useState(true);
  const [showAdmins, setShowAdmins] = useState(false)
  const [admins, setAdmins] = useState<string[]>([]);
  const handleOpen = () => setOpen(true);
  const handleClose = (values: string[] | null) => {
    setOpen(false)
    setCreateEvent(false)
    if (values || []) {
      const newAdmins = values || []
      setAdmins((prevAdmins) => [...new Set([...prevAdmins, ...newAdmins])]);
      setShowAdmins(true)
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      if (etiEventId) {
        const isValidId: RegExp = /^new$|^[\w\d]{20}$/;

        if (etiEventId === "new" || isValidId.test(etiEventId)) {
          try {
            const event = await getEvent(etiEventId);
            setEvent(event);
            setLoading(false);
            console.log(JSON.stringify(event.city))
          } catch (error) {
            console.error(error);
          }
        } else {
          navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
        }
      }
    };

    fetchData();
  }, [etiEventId]);

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


  const handleDelete = async (email: string) => {
    try {
      // setLoading(true);      
      if (idNuevo) {
        await unassignEventAdmin(email, idNuevo)
        setAdmins((currentAdmins) => currentAdmins.filter((admin) => admin !== email));
      } else {
        console.error('idNuevo es undefined. No se puede asignar administrador.');
      }

    } catch (error) {
      console.error('Error al borrar administrador:', error);
    } finally {
      // setLoading(false);
    }
  };

  const handleCreateEvent = async (values: any) => {
    try {
      await createOrUpdateDoc('events', values, idNuevo === 'new' ? undefined : idNuevo);
    } catch (error) {
      console.error(error);
    }
  }

  const useStyles = makeStyles({
    root: {
      '& .MuiOutlinedInput-root': {
        fontFamily: 'inter',
        '& fieldset': {
          borderColor: enable ? '#E68650' : '#FDE4AA',
          borderRadius: '8px',
          borderWidth: '1.5px',
          pointerEvents: 'none'
        },
        '&:hover fieldset ': {
          borderColor: enable ? '#E68650' : '#FDE4AA',
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '&.Mui-focused fieldset': {
          borderColor: enable ? '#E68650' : '#FDE4AA',
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: enable ? '#E68650' : '#FDE4AA',
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
            <Box sx={{ display: 'flex', flexDirection: 'column', boxShadow: 3, width: 929, height: 660, borderRadius: '12px', overflow: 'auto' }}>
              <Box sx={{ color: '#FFFFFF', backgroundColor: '#4B84DB', padding: '12px 24px 12px 24px', fontWeight: 600, fontSize: '24px', lineHeight: '16px', fontFamily: 'Montserrat', height: '40px' }}>
                Nuevo ETI
              </Box>

              <Box sx={{ display: 'flex', margin: '20px', backgroundColor: '#FAFAFA', borderRadius: '12px', p: 2 }}>
                <Grid container>
                  <Grid item xs={12}>
                    <Formik
                      enableReinitialize
                      initialValues={{
                        dateEnd: event?.dateEnd || '',
                        dateSignupOpen: event?.dateSignupOpen || '',
                        dateStart: event?.dateStart || '',
                        location: event?.location || '',
                        name: event?.name || ''
                      }}
                      validationSchema={EventFormSchema}
                      onSubmit={async (values, { setSubmitting }) => {
                        await save(values, setSubmitting);
                      }}
                    >
                      {({ setFieldValue, touched, errors, values }) => (
                        <Form>
                          <Grid container gap={2}>
                            <Typography sx={{ color: '#212121' }}>Nombre para el evento</Typography>
                            <Grid item md={12} sm={12} xs={12}>
                              <Field
                                name="name"
                                // label={t('Nombre del evento')}
                                placeholder="Nuevo ETI"
                                component={TextField}
                                required
                                fullWidth
                                classes={{ root: classes.root }}
                              // disabled={enable}                
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
                              />
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                              <Field
                                name="location"
                                // label={t('Lugar')}
                                placeholder="Lugar"
                                component={TextField}
                                required
                                fullWidth
                                classes={{ root: classes.root }}
                              // disabled={enable}      
                              />
                            </Grid>

                            <Typography>Fechas del evento</Typography>

                            <Grid container spacing={2}>

                              <Grid item md={4} sm={4} xs={4}>
                                <ETIDatePicker
                                  textFieldProps={{ fullWidth: true }}
                                  fieldName="dateStart"
                                  setFieldValue={setFieldValue}
                                  borderColor={enable}
                                  specialCase={false}
                                />
                              </Grid>
                              <Grid item md={4} sm={4} xs={4}>
                                <ETIDatePicker
                                  textFieldProps={{ fullWidth: true }}
                                  fieldName="dateEnd"
                                  setFieldValue={setFieldValue}
                                  borderColor={enable}
                                  specialCase={false}
                                />
                              </Grid>
                              <Grid item md={4} sm={4} xs={4}>
                                <ETIDatePicker
                                  textFieldProps={{ fullWidth: true }}
                                  fieldName="dateSignupOpen"
                                  setFieldValue={setFieldValue}
                                  borderColor={enable}
                                  specialCase={false}
                                />
                              </Grid>
                            </Grid>
                            <Grid container justifyContent="flex-end">
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
                            </Grid>
                            {idNuevo && (<>
                              <Grid item xs={12}>
                                <Grid container gap={2}>
                                  <Typography sx={{ color: '##424242' }}>Colaboradores en la organización del evento</Typography>
                                  <Grid item xs={12} sx={{ border: '1.5px solid #E68650', borderRadius: '8px' }}>
                                    <Button sx={{ width: '100%', padding: '12px, 16px, 12px, 16px', display: 'flex', justifyContent: 'space-between' }} onClick={handleOpen}>
                                      <Typography>
                                        Organizadores
                                      </Typography>
                                      <Icon sx={{ display: 'flex', width: '4em' }}>
                                        <Typography sx={{ mr: 1, color: '#A82548' }}>
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

                                {showAdmins && (<>
                                  <Grid item xs={12} sx={{ border: '1.5px solid #E68650', borderRadius: '8px', mt: 2 }}>
                                    {admins.map((admin, index) => (
                                      <Chip key={index} label={admin} onDelete={() => handleDelete(admin)} variant="outlined" sx={{ m: 1, borderRadius: '8px', color: '#A82548', fontFamily: 'Roboto', fontWeight: 500, fontSize: '14px' }} />
                                    ))}
                                  </Grid>
                                </>)}

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                  <Button disabled={createEvent} sx={{ width: '115px', padding: '12px, 32px, 12px, 32px', borderRadius: '25px', backgroundColor: createEvent ? '#CCCCCC' : '#A82548', height: '44px', '&:hover': { backgroundColor: createEvent ? '#CCCCCC' : '#A82548' } }} onClick={() => { onChange(), handleCreateEvent(values) }}>
                                    <Typography sx={{ color: '#FAFAFA', fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}>
                                      Crear
                                    </Typography>
                                  </Button>
                                </Box>

                              </Grid>
                            </>
                            )}
                          </Grid>
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
