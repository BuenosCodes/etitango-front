import React, { useContext, useEffect, useState } from 'react';
import { Button, CircularProgress, Container, Grid, MenuItem, Typography } from '@mui/material';
import WithAuthentication from '../withAuthentication';
import { createSignup, getSignupForUserAndEvent } from '../../helpers/firestore/signups';
import { getFutureEti } from '../../helpers/firestore/events';
import { auth } from '../../etiFirebase';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { Field, Form, Formik } from 'formik';
import { Select } from 'formik-mui';
import { bool, date, object, string } from 'yup';
import { SignupHelpWith } from '../../shared/signup';
import { LocationPicker } from '../../components/form/LocationPicker.tsx';
import { getDocument } from '../../helpers/firestore/index.js';
import { USERS } from '../../helpers/firestore/users';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../App.js';
import { ETIDatePicker } from '../../components/form/DatePicker.tsx';
import ReceiptUpload from '../../components/receiptUpload/index';
import { UserContext } from '../../helpers/UserContext';

export default function Inscripcion() {
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP], {
    useSuspense: false
  });

  const [etiEvent, setEtiEvent] = useState();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [signUpDetails, setSignUpDetails] = useState(null);

  const { user } = useContext(UserContext);
  useEffect(() => {
    async function fetch() {
      const futureEtiEvent = await getFutureEti();
      setEtiEvent(futureEtiEvent);
      if (user.uid && getFutureEti) {
        setSignUpDetails(await getSignupForUserAndEvent(user.uid, futureEtiEvent.id));
      }
    }

    fetch();
  }, [user, etiEvent]);

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

  const renderAlreadySignedUpMessage = () => (
    <Grid item style={{ textAlign: 'center' }}>
      <Typography variant="h6">{t(`${SCOPES.MODULES.SIGN_UP}.alreadySignedUpReason`)}</Typography>
      <ReceiptUpload
        etiEventId={etiEvent?.id}
        signUpDetails={signUpDetails}
        userId={auth.currentUser?.uid}
        setSignUpDetails={setSignUpDetails}
      />
    </Grid>
  );

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
            ) : signUpDetails?.id ? (
              renderAlreadySignedUpMessage()
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
                        <ETIDatePicker
                          label={t('dateArrival')}
                          fieldName="dateArrival"
                          setFieldValue={setFieldValue}
                          textFieldProps={{ fullWidth: true }}
                        />
                      </Grid>
                      <Grid item md={4} sm={4} xs={12}>
                        <ETIDatePicker
                          label={t('dateDeparture')}
                          fieldName="dateDeparture"
                          setFieldValue={setFieldValue}
                          textFieldProps={{ fullWidth: true }}
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
                          <Typography>$12000 hasta el 16/10.</Typography>
                          <Typography>$14000 a partir del 16/10.</Typography>
                          Incluye 72 hs corridas de Tango. Milonga de bienvenida, 3 milongas
                          nocturnas, 2 afters, almuerzo sabado, asado domingo.
                        </Grid>
                        <Grid container justifyContent="flex-end">
                          <Grid item>
                            <Button
                              variant="contained"
                              color="secondary"
                              type="submit"
                              disabled={!!signUpDetails?.id || isSubmitting}
                            >
                              {t(`${SCOPES.MODULES.SIGN_UP}.${'signUp'}`).toUpperCase()}
                            </Button>
                          </Grid>
                        </Grid>
                        <Grid item style={{ textAlign: 'center' }}>
                          <Typography variant="caption">
                            {t(`${SCOPES.MODULES.SIGN_UP}.disclaimer`)}
                            <b>13 de octubre</b>.<br />
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
