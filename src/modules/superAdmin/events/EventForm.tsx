import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography
} from '@mui/material';
import WithAuthentication from '../../withAuthentication';
import { Translation } from 'react-i18next';
import { argentinaCurrencyFormatter, argentinaDateFormatter, SCOPES } from 'helpers/constants/i18n';
import { Field, FieldArray, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { array, date, number, object, string } from 'yup';
import { createOrUpdateDoc } from 'helpers/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../App.js';
import { getEventLive, uploadEventImage } from '../../../helpers/firestore/events';
import { EtiEvent, PriceSchedule } from '../../../shared/etiEvent';
import { UserRoles } from '../../../shared/User';
import { ETIDatePicker } from '../../../components/form/DatePicker';
import RolesList from '../roles/RolesList';
import FileUpload from '../../../components/FileUpload';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DateTimePicker } from 'formik-mui-x-date-pickers';
import { Unsubscribe } from 'firebase/firestore';

export default function EventForm() {
  const EventFormSchema = object({
    dateEnd: date().required('Este campo no puede estar vacío'),
    dateSignupOpen: date().required('Este campo no puede estar vacío'),
    dateStart: date().required('Este campo no puede estar vacío'),
    location: string().required('Este campo no puede estar vacío'),
    name: string().required('Este campo no puede estar vacío'),
    prices: array()
      .of(
        object().shape({
          deadline: date().required('Este campo no puede estar vacío'),
          price: number().required('Este campo no puede estar vacío')
        })
      )
      .min(1, 'Debe haber al menos un precio')
      .required('Debe haber al menos un precio'),
    bank: object().shape({
      entity: string().required('Este campo no puede estar vacío'),
      holder: string().required('Este campo no puede estar vacío'),
      cbu: string().required('Este campo no puede estar vacío'),
      alias: string().required('Este campo no puede estar vacío'),
      cuit: string().required('Este campo no puede estar vacío')
    })
  });

  const [event, setEvent] = useState<EtiEvent>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    const fetchData = async () => {
      if (id) {
        unsubscribe = await getEventLive(id, setEvent, setLoading);
      }
    };
    fetchData().catch((error) => console.error(error));
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [id]);

  const save = async ({ dateSignupOpen, ...values }: any, setSubmitting: Function) => {
    try {
      const data = {
        ...values,
        comboReturnDeadlineHuman: argentinaDateFormatter.format(values.comboReturnDeadline),
        dateSignupOpen: dateSignupOpen.toDate ? dateSignupOpen.toDate() : dateSignupOpen,
        // @ts-ignore
        prices: values.prices.map(({ deadline, price, ...rest }) => {
          return {
            ...rest,
            deadline,
            price,
            priceHuman: argentinaCurrencyFormatter.format(price),
            deadlineHuman: argentinaDateFormatter.format(deadline)
          };
        })
      };
      await createOrUpdateDoc('events', data, id === 'new' ? undefined : id);
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
          <WithAuthentication roles={[UserRoles.SUPER_ADMIN]} />
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
              >
                <Grid item sx={{ my: 3, typography: 'h5', color: 'secondary.main' }}>
                  EVENTS
                </Grid>
                <Formik
                  initialValues={{
                    ...event,
                    prices:
                      event?.prices?.length && event?.prices?.length > 0
                        ? event?.prices
                        : [{ price: '', deadline: '' }],
                    schedule: event?.schedule || [
                      { title: 'Viernes XX', activities: '' },
                      { title: 'Sábado XX', activities: '' },
                      { title: 'Domingo XX', activities: '' }
                    ],
                    locations: event?.locations || [{ name: '', link: '' }]
                  }}
                  validationSchema={EventFormSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    await save(values, setSubmitting);
                  }}
                >
                  {({ isSubmitting, setFieldValue, errors, values }) => (
                    <Form>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="general">
                          Datos Generales
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item md={6} sm={6} xs={12}>
                              <Field
                                name="name"
                                label={t('name')}
                                component={TextField}
                                required
                                fullWidth
                              />
                            </Grid>
                            <Grid item md={6} sm={6} xs={12}>
                              <Field
                                name="location"
                                label={t('location')}
                                component={TextField}
                                required
                                fullWidth
                              />
                            </Grid>
                            <Grid item md={6} sm={6} xs={12}>
                              <Field
                                name="daysBeforeExpiration"
                                label={t('daysBeforeExpiration')}
                                component={TextField}
                                type="number"
                                required
                                fullWidth
                              />
                            </Grid>
                            <Grid item md={6} sm={6} xs={12}>
                              <Field
                                name="capacity"
                                label={t('capacity')}
                                component={TextField}
                                type="number"
                                required
                                fullWidth
                              />
                            </Grid>
                            <Grid item md={4} sm={4} xs={12}>
                              <ETIDatePicker
                                textFieldProps={{ fullWidth: true }}
                                label={t('dateStart')}
                                fieldName="dateStart"
                                setFieldValue={setFieldValue}
                              />
                            </Grid>
                            <Grid item md={4} sm={4} xs={12}>
                              <ETIDatePicker
                                textFieldProps={{ fullWidth: true }}
                                label={t('dateEnd')}
                                fieldName="dateEnd"
                                setFieldValue={setFieldValue}
                              />
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                              <Field
                                textFieldProps={{ fullWidth: true }}
                                label={t('dateSignupOpen')}
                                name="dateSignupOpen"
                                setFieldValue={setFieldValue}
                                component={DateTimePicker}
                              />
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                              <ETIDatePicker
                                textFieldProps={{ fullWidth: true }}
                                label={t('comboReturnDeadline')}
                                fieldName="comboReturnDeadline"
                                setFieldValue={setFieldValue}
                              />
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                              <Field
                                name="landingTitle"
                                label={t('landingTitle')}
                                component={TextField}
                                required
                                fullWidth
                              />
                              (Este es el texto que se muestra sobre la imágen de la portada - ej
                              {'ToninETI - 24, 25 y 26 de Marzo'})
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="pricing">
                          <Grid item xs={12}>
                            <Typography>Precios</Typography>
                          </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2} my={4}>
                            <FieldArray name="prices">
                              {({ form, remove, push }) => (
                                <>
                                  {form.values.prices?.map(
                                    (price: PriceSchedule, index: number) => (
                                      <React.Fragment key={'price_' + index}>
                                        <Grid item md={4} sm={4} xs={12}>
                                          <ETIDatePicker
                                            textFieldProps={{ fullWidth: true }}
                                            label={t('deadline')}
                                            fieldName={`prices.${index}.deadline`}
                                            setFieldValue={setFieldValue}
                                            index={index}
                                          />
                                        </Grid>
                                        <Grid item md={6} sm={6} xs={12}>
                                          <Field
                                            name={`prices.${index}.price`}
                                            type="number"
                                            label={t('price')}
                                            component={TextField}
                                            required
                                          />
                                        </Grid>

                                        <Button // TODO ALDI reemplazar por un icono de eliminar o (-)
                                          variant="contained"
                                          color="primary"
                                          onClick={() => remove(index)}
                                        >
                                          Quitar
                                        </Button>
                                      </React.Fragment>
                                    )
                                  )}

                                  <Button // TODO ALDI reemplazar por un botón de (+)
                                    variant="contained"
                                    color="primary"
                                    onClick={() => push({ price: '', deadline: '' })}
                                  >
                                    Agregar Precio
                                  </Button>
                                </>
                              )}
                            </FieldArray>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="bank">
                          Datos Bancarios
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2} my={4}>
                            <Grid item xs={12}>
                              <Typography>Datos Bancarios</Typography>
                            </Grid>
                            {['entity', 'holder', 'cbu', 'alias', 'cuit'].map((f) => (
                              <Grid key={f} item md={6} sm={6} xs={12}>
                                <Field
                                  name={`bank[${f}]`}
                                  label={t(f)}
                                  component={TextField}
                                  fullWidth
                                  required
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="schedule">
                          Cronograma
                        </AccordionSummary>
                        <AccordionDetails>
                          <FieldArray name="schedule">
                            {({ push, remove }) => (
                              <>
                                {values.schedule.map((_, dayIndex: number) => (
                                  <Grid key={'schedule_' + dayIndex} item xs={12} my={2}>
                                    <h3>Dia {dayIndex + 1}</h3>
                                    <Grid item my={2}>
                                      <Field
                                        name={`schedule.${dayIndex}.title`}
                                        component={TextField}
                                        required
                                        label={'Dia'}
                                      />
                                      <Button variant="contained" onClick={() => remove(dayIndex)}>
                                        Quitar día
                                      </Button>
                                    </Grid>
                                    <Grid item my={2}>
                                      <Field
                                        name={`schedule.${dayIndex}.activities`}
                                        component={TextField}
                                        fullWidth
                                        required
                                        label={'Actividades'}
                                        multiline
                                      />
                                    </Grid>
                                  </Grid>
                                ))}
                                <Button variant="contained" onClick={() => push([])}>
                                  Agregar día
                                </Button>
                              </>
                            )}
                          </FieldArray>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="schedule">
                          Ubicaciones
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <FieldArray name="locations">
                              {({ push, remove }) => (
                                <Grid key={'locations'} item xs={12} my={2}>
                                  {values.locations.map((_, i: number) => (
                                    <Grid key={'locations_' + i} item my={2}>
                                      <Grid item my={2}>
                                        <Field
                                          name={`locations.${i}.name`}
                                          component={TextField}
                                          required
                                          label={'Nombre'}
                                        />
                                        <Button variant="contained" onClick={() => remove(i)}>
                                          Quitar ubicación
                                        </Button>
                                      </Grid>
                                      <Grid item my={2}>
                                        <Field
                                          name={`locations.${i}.link`}
                                          component={TextField}
                                          fullWidth
                                          required
                                          label={'Link (google maps)'}
                                        />
                                      </Grid>
                                    </Grid>
                                  ))}
                                  <Button
                                    variant="contained"
                                    onClick={() => push({ name: '', link: '' })}
                                  >
                                    Agregar Ubicación
                                  </Button>
                                </Grid>
                              )}
                            </FieldArray>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>

                      <Grid container justifyContent="flex-end">
                        {(!values?.prices?.length ||
                          values?.prices?.some(({ deadline }) => deadline <= new Date())) && (
                          <Alert severity="warning">
                            Las Fechas de Pago deben ser en el futuro
                          </Alert>
                        )}
                        <Grid item>
                          <Button
                            variant="contained"
                            color="secondary"
                            type="submit"
                            disabled={isSubmitting || !!Object.keys(errors).length}
                          >
                            Save
                          </Button>
                        </Grid>
                      </Grid>
                    </Form>
                  )}
                </Formik>
                {event?.id ? (
                  <Grid container spacing={2} my={4}>
                    <Grid item xs={12}>
                      <Typography>Imagen</Typography>
                    </Grid>
                    <FileUpload
                      uploadFunction={(file: File) => uploadEventImage(event?.id!, file)}
                      notifications={{
                        successMsg: 'Archivo subido con éxito',
                        errorMsg: 'Error al subir archivo'
                      }}
                    />
                    <img
                      src={event?.image}
                      alt="Receipt"
                      style={{ maxWidth: '50%', height: 'auto' }}
                    />
                  </Grid>
                ) : (
                  <Typography>Guardá el evento para subir la imagen</Typography>
                )}
              </Grid>
              <RolesList eventId={id} />;
            </Container>
          )}
        </>
      )}
    </Translation>
  );
}
