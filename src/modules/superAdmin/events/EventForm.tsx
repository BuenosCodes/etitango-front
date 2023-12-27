/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Container, Grid } from '@mui/material';
import WithAuthentication from '../../withAuthentication';
import { Translation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { date, object, string } from 'yup';
import { createOrUpdateDoc } from 'helpers/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../App.js';
import { getEvent } from '../../../helpers/firestore/events';
import { EtiEvent } from '../../../shared/etiEvent';
import { UserRoles } from '../../../shared/User';
import { ETIDatePicker } from '../../../components/form/DatePicker';
import RolesList from '../roles/RolesList';
import { LocationPicker } from 'components/form/LocationPicker';

export default function EventForm() {
  
  const alertText: string = 'Este campo no puede estar vacío';

  const EventFormSchema = object({

    dateStart: date().required('Este campo no puede estar vacío'),
    dateEnd: date().when('dateStart', (dateStart, schema) => (dateStart && schema.min(dateStart, "No puede ser menor a la fecha de inicio"))).required('Este campo no puede estar vacío'),
    dateSignupOpen: date().when('dateStart', (dateStart, schema) => (dateStart && schema.max(dateStart, "No puede ser mayor a la fecha de inicio"))).required('Este campo no puede estar vacío'),
    location: string().required('Este campo no puede estar vacío'),
    name: string().required('Este campo no puede estar vacío'),
    country: string().nullable(true).required('Este campo no puede estar vacío'),
    province: string()
      .nullable(true)
      .when('country', {
        is: 'Argentina',
        then: string().nullable(true).required('Este campo no puede estar vacío')
      }),
    city: string()
      .nullable(true)
      .when('country', {
        is: 'Argentina',
        then: string().nullable(true).required('Este campo no puede estar vacío')
      }),
  });
  const [event, setEvent] = useState<EtiEvent>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const isValidId: RegExp = /^new$|^[\w\d]{20}$/;

        if (id === "new" || isValidId.test(id)) {
          try {
            const event = await getEvent(id);
            setEvent(event);
            setLoading(false);
          } catch (error) {
            console.error(error);
          }
        } else {
          navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
        }
      }
    };

    fetchData();
  }, [id]);
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (id) {
  //       const isValidId: RegExp = /^new$|^[\w\d]{20}$/;
  //       if (id === "new" || isValidId.test(id)) {
  //         const event = await getEvent(id);
  //         setEvent(event);
  //         setLoading(false);
  //     } else {
  //       navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`)
  //     }
  //   };
  //   fetchData().catch((error) => console.error(error));
  // }}, [id]);

  const save = async (values: any, setSubmitting: Function) => {
    try {
      if (id) {
        const validateRuote: RegExp = /^[a-zA-Z0-9]{20,}$/; 
        const idV : boolean = validateRuote.test(id);
        await createOrUpdateDoc('events', values, id === 'new' ? undefined : idV);
        navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
      }
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
          <WithAuthentication
            roles={[UserRoles.SUPER_ADMIN]}
            redirectUrl={`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`}
          />
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
                  enableReinitialize
                  initialValues={{
                    dateEnd: event?.dateEnd || '',
                    dateSignupOpen: event?.dateSignupOpen || '',
                    dateStart: event?.dateStart || '',
                    location: event?.location || '',
                    name: event?.name || '',
                    

                  }}
                  validationSchema={EventFormSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    await save(values, setSubmitting);
                  }}
                >
                  {({ isSubmitting, setFieldValue, touched, errors, values }) => (
                    <Form>
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
                        <Grid item md={4} sm={4} xs={12}>
                          <ETIDatePicker
                            textFieldProps={{ fullWidth: true }}
                            
                            fieldName="dateStart"
                            setFieldValue={setFieldValue}
                          />
                        </Grid>
                        <Grid item md={4} sm={4} xs={12}>
                          <ETIDatePicker
                            textFieldProps={{ fullWidth: true }}
                            
                            fieldName="dateEnd"
                            setFieldValue={setFieldValue}
                          />
                        </Grid>
                        <Grid item md={4} sm={4} xs={12}>
                          <ETIDatePicker
                            textFieldProps={{ fullWidth: true }}
                           
                            fieldName="dateSignupOpen"
                            setFieldValue={setFieldValue}
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
              </Grid>
              <RolesList eventId={id} />
            </Container>
          )}
        </>
      )}
    </Translation>
  );
}
