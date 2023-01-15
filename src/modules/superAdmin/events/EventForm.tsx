import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Container, Grid } from '@mui/material';
import WithAuthentication from '../../withAuthentication';
import { Translation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { date, object, string } from 'yup';
import { createOrUpdateDoc, getDocument } from 'helpers/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../App.js';
import { EVENTS } from '../../../helpers/firestore/events';
import { EtiEvent } from '../../../shared/etiEvent';
import { DatePicker } from 'formik-mui-x-date-pickers';
import { UserRoles } from '../../../shared/User';

export default function EventForm() {
  const EventFormSchema = object({
    dateEnd: date().required('Este campo no puede estar vacío'),
    dateSignupOpen: date().required('Este campo no puede estar vacío'),
    dateStart: date().required('Este campo no puede estar vacío'),
    location: string().required('Este campo no puede estar vacío'),
    name: string().required('Este campo no puede estar vacío')
  });
  const [event, setEvent] = useState<EtiEvent>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const event = (await getDocument(`${EVENTS}/${id}`)) as EtiEvent;
        setEvent(event!);
        setLoading(false);
      }
    };
    fetchData().catch((error) => console.error(error));
  }, [id]);

  const prepareForSave = (event: any) => {
    let output: any = { ...event };
    const dateFields: (keyof EtiEvent)[] = ['dateStart', 'dateEnd', 'dateSignupOpen'];
    dateFields.forEach((field) => {
      if (event[field]) {
        output[field] = event[field]!.toDate();
      }
    });
    return output;
  };
  const save = async (values: any, setSubmitting: Function) => {
    const data = prepareForSave(values);

    try {
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
                    name: event?.name || ''
                  }}
                  validationSchema={EventFormSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    await save(values, setSubmitting);
                  }}
                >
                  {({ isSubmitting }) => (
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
                          <Field
                            component={DatePicker}
                            disablePast
                            textField={{ fullWidth: true }}
                            label={t('dateStart')}
                            name="dateStart"
                            inputFormat="DD-MM-YYYY"
                            mask="__-__-____"
                          />
                        </Grid>
                        <Grid item md={4} sm={4} xs={12}>
                          <Field
                            component={DatePicker}
                            disablePast
                            textField={{ fullWidth: true }}
                            label={t('dateEnd')}
                            name="dateEnd"
                            inputFormat="DD-MM-YYYY"
                            mask="__-__-____"
                          />
                        </Grid>
                        <Grid item md={4} sm={4} xs={12}>
                          <Field
                            component={DatePicker}
                            disablePast
                            textField={{ fullWidth: true }}
                            label={t('dateSignupOpen')}
                            name="dateSignupOpen"
                            inputFormat="DD-MM-YYYY"
                            mask="__-__-____"
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
            </Container>
          )}
        </>
      )}
    </Translation>
  );
}
