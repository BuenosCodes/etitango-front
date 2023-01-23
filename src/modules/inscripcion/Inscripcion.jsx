import React, { useContext, useEffect, useState } from 'react';
import { Button, CircularProgress, Container, Grid, MenuItem, Typography } from '@mui/material';
import WithAuthentication from '../withAuthentication';
import { createSignup, validateSignUp } from '../../helpers/firestore/signups';
import { getFutureEti } from '../../helpers/firestore/events';
import { auth } from '../../etiFirebase';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { Field, Form, Formik } from 'formik';
import { Select } from 'formik-mui';
import { DatePicker } from 'formik-mui-x-date-pickers';
import { bool, date, object, string } from 'yup';
import { SignupHelpWith } from '../../shared/signup';
import { LocationPicker } from '../LocationPicker';
import { getDocument } from '../../helpers/firestore/index.js';
import { USERS } from '../../helpers/firestore/users';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../App.js';
import { ERROR_CODES } from '../../helpers/constants/errorCodes.ts';
import { NotificationContext } from '../../helpers/NotificationContext';

export default function Inscripcion() {
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP], {
    useSuspense: false
  });

  const [etiEvent, setEtiEvent] = useState();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSignedUp, setIsSignedUp] = useState(false);

  const { setNotification } = useContext(NotificationContext);

  const handleError = (error) => {
    if (error.code === ERROR_CODES.SIGNUPS.ALREADY_SIGNED_UP) {
      setIsSignedUp(true);
      setNotification(t(`${SCOPES.MODULES.SIGN_UP}.alreadySignedUpReason`), { severity: 'info' });
    }
  };

  useEffect(() => {
    const getFormData = async () => {
      const futureEtiEvent = await getFutureEti();
      setEtiEvent(futureEtiEvent);
      const etiEventId = futureEtiEvent?.id;
      if (etiEventId) {
        await validateSignUp(etiEventId);
      }
    };
    getFormData().catch(handleError);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser?.uid) {
        const user = await getDocument(`${USERS}/${auth.currentUser.uid}`);
        setUserData(user);
        setLoading(false);
      }
    };
    fetchData().catch((error) => console.error(error));
  }, [auth.currentUser?.uid]);

  const SignupSchema = object({
    helpWith: string().required('Este campo no puede estar vacío'),
    food: string().required('Este campo no puede estar vacío'),
    isCeliac: bool().required('Este campo no puede estar vacío'),
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
    dateArrival: date().required('Este campo no puede estar vacío'),
    dateDeparture: date().required('Este campo no puede estar vacío')
  });

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser?.uid) {
        const user = await getDocument(`${USERS}/${auth.currentUser.uid}`);
        setUserData(user);
        setLoading(false);
      }
    };
    fetchData().catch((error) => console.error(error));
  }, [auth.currentUser?.uid]);
  const navigate = useNavigate();
  const save = async (values, setSubmitting) => {
    const { dateArrival, dateDeparture, helpWith, food, isCeliac, country, province, city } =
      values;
    let data = {
      dateArrival,
      dateDeparture,
      helpWith,
      food,
      isCeliac,
      country,
      province,
      city
    };
    try {
      await createSignup(etiEvent?.id, auth.currentUser.uid, data);
      navigate(ROUTES.SIGNUPS);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      //TODO global error handling this.setState({errors: error.response.data})
    }
  };

  return (
    <>
      <WithAuthentication />
      <Container maxWidth="lg" sx={{ marginTop: 3 }}>
        {etiEvent?.dateSignupOpen > new Date() ? (
          <Typography color={'error.dark'} textAlign={'center'}>
            {t(`${SCOPES.MODULES.SIGN_UP}.signupClosed`)} {etiEvent.dateSignupOpen.toLocaleString()}
          </Typography>
        ) : (
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={3}
          >
            <Grid item sx={{ mb: 3 }}>
              <Typography variant="h5" color="secondary" align="center">
                {t(`${SCOPES.MODULES.SIGN_UP}.title`)}
              </Typography>
              <Typography variant="h5" color="secondary" align="center">
                {etiEvent?.name}
              </Typography>
            </Grid>
            {loading ? (
              <CircularProgress />
            ) : (
              <Formik
                enableReinitialize
                initialValues={{
                  nameFirst: userData.nameFirst,
                  nameLast: userData.nameLast,
                  dniNumber: userData.dniNumber,
                  helpWith: '',
                  food: userData.food,
                  isCeliac: userData.isCeliac,
                  country: userData.country,
                  province: userData.province,
                  city: userData.city,
                  dateArrival: etiEvent?.dateStart,
                  dateDeparture: etiEvent?.dateEnd,
                  email: auth?.currentUser?.email
                }}
                validationSchema={SignupSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  await save(values, setSubmitting);
                }}
              >
                {({ isSubmitting, touched, errors, setFieldValue, values }) => (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item md={4} sm={4} xs={12}>
                        <Field
                          component={DatePicker}
                          disablePast
                          textField={{ fullWidth: true }}
                          label={t('dateArrival')}
                          name="date_arrival"
                          inputFormat="DD-MM-YYYY"
                          mask="__-__-____"
                        />
                      </Grid>
                      <Grid item md={4} sm={4} xs={12}>
                        <Field
                          component={DatePicker}
                          disablePast
                          textField={{ fullWidth: true }}
                          label={t('dateDeparture')}
                          name="date_departure"
                          inputFormat="DD-MM-YYYY"
                          mask="__-__-____"
                        />
                      </Grid>
                      <Grid item md={4} sm={4} xs={12}>
                        <Field
                          component={Select}
                          id="helpWith"
                          name="helpWith"
                          labelId="helpwith-label"
                          label={t('helpWith')}
                          formControl={{ fullWidth: true }}
                        >
                          {Object.values(SignupHelpWith).map((help) => (
                            <MenuItem key={help} value={help}>
                              {t(help)}
                            </MenuItem>
                          ))}
                        </Field>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography sx={{ mb: 1 }}>{t('whereAreYouComingFrom')}</Typography>
                        <LocationPicker
                          values={values}
                          setFieldValue={setFieldValue}
                          touched={touched}
                          errors={errors}
                          t={t}
                          location={userData}
                        />
                      </Grid>
                      <Grid item container justifyContent={'center'}>
                        <Grid item style={{ textAlign: 'center' }} justifyContent={'center'}>
                          <Typography variant="h3" color="primary" align="center">
                            {t(`${SCOPES.MODULES.SIGN_UP}.combo`)}
                          </Typography>
                          <Typography>$5800</Typography>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                          <Grid item>
                            <Button
                              variant="contained"
                              color="secondary"
                              type="submit"
                              disabled={isSignedUp || isSubmitting}
                            >
                              {t(
                                `${SCOPES.MODULES.SIGN_UP}.${
                                  isSignedUp ? 'alreadySignedUp' : 'signUp'
                                }`
                              ).toUpperCase()}
                            </Button>
                          </Grid>
                        </Grid>
                        <Grid item style={{ textAlign: 'center' }}>
                          <Typography variant="caption">
                            {t(`${SCOPES.MODULES.SIGN_UP}.disclaimer`)}
                            <b>martes 28 de Febrero</b>.<br />
                            {t(`${SCOPES.MODULES.SIGN_UP}.disclaimer2`)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            )}
          </Grid>
        )}
      </Container>
    </>
  );
}
