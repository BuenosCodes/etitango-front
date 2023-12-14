/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
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
import { getEvent } from '../../../helpers/firestore/events';
import { EtiEvent } from '../../../shared/etiEvent';
import { UserRoles } from '../../../shared/User';
import { ETIDatePicker } from '../../../components/form/DatePicker';
import RolesList from '../roles/RolesList';
import CloudinaryUploadWidget from 'components/CloudinaryUploadWidget';
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";

export default function EditEvent() {

  const [publicId, setPublicId] = useState("");
  // Replace with your own cloud name
  const [cloudName] = useState("dg2py4um1");
  // Replace with your own upload preset
  const [uploadPreset] = useState("wx4mlrt5");

  const [uwConfig] = useState({
    cloudName,
    uploadPreset
  })

  const cld = new Cloudinary({
    cloud: {
      cloudName
    }
  });

  const myImage = cld.image(publicId);

  const alertText: string = 'Este campo no puede estar vacío';

  const EventFormSchema = object({
    dateEnd: date().required(alertText),
    dateSignupOpen: date().required(alertText),
    dateStart: date().required(alertText),
    location: string().required(alertText),
    name: string().required(alertText)
  });

  const [event, setEvent] = useState<EtiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const eventExists = await getDocument(`events/${id}`);
        if (eventExists) {
          const event = await getEvent(id);
          setEvent(event);
        } else {
          navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
        }
        setLoading(false);
      }
    };
    fetchData().catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, [id]);


  const save = async (values: any, setSubmitting: Function) => {
    try {
      await createOrUpdateDoc('events', values, id === 'new' ? undefined : id);
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
            roles={[UserRoles.ADMIN]}
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
                  {({ isSubmitting, setFieldValue }) => (
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
                        <Grid item md={4} sm={4} xs={12}>
                          <ETIDatePicker
                            textFieldProps={{ fullWidth: true }}
                            label={t('dateSignupOpen')}
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
              </Grid>
              <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} />
              <div style={{width: "200px"}}>
                <AdvancedImage
                  style={{ maxWidth: "100%" }}
                  cldImg={myImage}
                  plugins={[responsive(), placeholder()]}
                />
              </div>
              <RolesList eventId={id} />
            </Container>
          )}
        </>
      )}
    </Translation>
  );
}
