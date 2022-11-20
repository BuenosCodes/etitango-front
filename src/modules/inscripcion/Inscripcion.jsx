import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Grid,
  MenuItem,
  TextField as TextFieldMUI,
  Typography
} from '@mui/material';
import WithAuthentication from './withAuthentication';
import { createSignup } from '../../helpers/firestore/signups';
import { getCities, getProvinces } from '../../helpers/thirdParties/georef';
import { getCountries } from '../../helpers/thirdParties/restCountries';
import { getFutureEti } from '../../helpers/firestore/events';
import { auth } from '../../etiFirebase';
import { Translation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { Field, Form, Formik } from 'formik';
import { Autocomplete, CheckboxWithLabel, Select, TextField } from 'formik-mui';
import { DatePicker } from 'formik-mui-x-date-pickers';
import { bool, date, number, object, string } from 'yup';
import { FoodChoices, SignupHelpWith } from '../../shared/signup';

export default function Inscripcion() {
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [etiEvent, setEtiEvent] = useState();
  const [isArgentina, setIsArgentina] = useState(false);
  useEffect(() => {
    const getFormData = async () => {
      const [countries, etiEvent] = await Promise.all([getCountries(), getFutureEti()]);
      setCountries(countries);
      setEtiEvent(etiEvent);
    };
    getFormData().catch((error) => console.error(error));
  }, []);
  const SignupSchema = object({
    nameFirst: string()
      .required('Este campo no puede estar vacío')
      .test(
        'length',
        'El nombre debe tener menos de 32 caracteres',
        (value) => !value || (value && value.length <= 32)
      ),
    nameLast: string()
      .required('Este campo no puede estar vacío')
      .test(
        'length',
        'El apellido debe tener menos de 32 caracteres',
        (value) => !value || (value && value.length <= 32)
      ),
    dniNumber: number()
      .required('Completa este campo')
      .positive()
      .typeError('El DNI debe contener números únicamente')
      .test(
        'dni_length',
        'El DNI debe tener menos de 11 números',
        (value) => !value || (value && value.toString().length <= 11)
      ),
    email: string().required('Este campo no puede estar vacío').email('Formato de mail inválido'),
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
  const handleCountryChange = (value, setFieldValue) => {
    const isArgentina = value === 'Argentina';
    if (isArgentina) {
      getProvinces().then((provinces) => setProvinces(provinces));
    } else {
      setProvinces([]);
    }
    setIsArgentina(isArgentina);
    setFieldValue('country', value);
    setFieldValue('province', null);
    setFieldValue('city', null);
  };

  const handleProvinceChange = (value, setFieldValue) => {
    if (value) {
      getCities(value).then((cities) => setCities(cities));
    } else {
      setCities([]);
    }
    setFieldValue('province', value);
    setFieldValue('city', null);
  };
  const save = async (values, setSubmitting) => {
    const {
      nameFirst,
      nameLast,
      email,
      dniNumber,
      dateArrival,
      dateDeparture,
      helpWith,
      food,
      isCeliac,
      country,
      province,
      city
    } = values;
    let data = {
      nameFirst,
      nameLast,
      email,
      dniNumber,
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
      window.location.href = `${window.location.protocol}//${
        // eslint-disable-next-line no-undef
        process.env.REACT_APP_FRONT_END_URL || 'localhost:3000'
      }/lista-inscriptos`;
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      //TODO global error handling this.setState({errors: error.response.data})
    }
  };

  return (
    <Translation ns={[SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP]} useSuspense={false}>
      {(t) => (
        <>
          <WithAuthentication redirectUrl={'inscripcion'} />
          <Container maxWidth="lg" sx={{ marginTop: 6 }}>
            {etiEvent?.dateSignupOpen > new Date() ? (
              <Typography>
                {t(`${SCOPES.MODULES.SIGN_UP}.signupClosed`)}{' '}
                {etiEvent.dateSignupOpen.toLocaleString()}
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
                  <Typography variant="h2" color="secondary" align="center">
                    {t(`${SCOPES.MODULES.SIGN_UP}.title`)}
                  </Typography>
                  <Typography variant="h2" color="secondary" align="center">
                    {etiEvent?.name}
                  </Typography>
                </Grid>
                <Formik
                  enableReinitialize
                  initialValues={{
                    nameFirst: '',
                    nameLast: '',
                    dniNumber: '',
                    helpWith: '',
                    food: '',
                    isCeliac: false,
                    country: null,
                    province: null,
                    city: null,
                    dateArrival: etiEvent?.dateStart,
                    dateDeparture: etiEvent?.dateEnd,
                    email: auth?.currentUser?.email
                  }}
                  validationSchema={SignupSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    await save(values, setSubmitting);
                  }}
                >
                  {({ isSubmitting, touched, errors, setFieldValue }) => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item md={6} sm={6} xs={12}>
                          <Field
                            name="nameFirst"
                            label={t('nameFirst')}
                            component={TextField}
                            required
                            fullWidth
                          />
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                          <Field
                            name="nameLast"
                            label={t('nameLast')}
                            component={TextField}
                            required
                            fullWidth
                          />
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                          <Field
                            name="email"
                            label={t('email')}
                            type="email"
                            component={TextField}
                            disabled
                            required
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                          <Field
                            name="dniNumber"
                            label={t('dniNumber')}
                            component={TextField}
                            required
                            fullWidth
                          />
                        </Grid>
                        <Grid item md={6} sm={6} xs={6}>
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
                        <Grid item md={6} sm={6} xs={6}>
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
                        <Grid item md={4} sm={4} xs={12}>
                          <Field
                            component={Select}
                            id="food"
                            name="food"
                            labelId="food-label"
                            label={t('food')}
                            formControl={{ fullWidth: true }}
                          >
                            {Object.values(FoodChoices).map((food) => (
                              <MenuItem key={food} value={food}>
                                {t(food)}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>
                        <Grid item md={4} sm={4} xs={12}>
                          <Field
                            component={CheckboxWithLabel}
                            type="checkbox"
                            name="isCeliac"
                            Label={{ label: t('isCeliac') }}
                          />
                        </Grid>
                        <Grid item md={4} sm={4} xs={12}>
                          <Field
                            name="countries"
                            component={Autocomplete}
                            disablePortal
                            fullWidth
                            options={countries}
                            getOptionLabel={(option) => option}
                            onChange={(_, value) => handleCountryChange(value, setFieldValue)}
                            renderInput={(params) => (
                              <TextFieldMUI
                                {...params}
                                name="country"
                                error={touched['country'] && !!errors['country']}
                                helperText={touched['country'] && errors['country']}
                                label={t('country')}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>
                        {isArgentina && (
                          <>
                            <Grid item md={4} sm={4} xs={12}>
                              <Field
                                name="provinces"
                                component={Autocomplete}
                                disablePortal
                                fullWidth
                                options={provinces}
                                getOptionLabel={(option) => option}
                                onChange={(_, value) => handleProvinceChange(value, setFieldValue)}
                                renderInput={(params) => (
                                  <TextFieldMUI
                                    {...params}
                                    name="province"
                                    error={touched['province'] && !!errors['province']}
                                    helperText={touched['province'] && errors['province']}
                                    label={t('province')}
                                    variant="outlined"
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item md={4} sm={4} xs={12}>
                              <Field
                                name="cities"
                                component={Autocomplete}
                                disablePortal
                                fullWidth
                                options={cities}
                                getOptionLabel={(option) => option}
                                onChange={(_, value) => setFieldValue('city', value)}
                                renderInput={(params) => (
                                  <TextFieldMUI
                                    {...params}
                                    name="city"
                                    error={touched['city'] && !!errors['city']}
                                    helperText={touched['city'] && errors['city']}
                                    label={t('city')}
                                    variant="outlined"
                                  />
                                )}
                              />
                            </Grid>
                          </>
                        )}
                        <Grid item container justifyContent={'center'}>
                          <Grid item style={{ textAlign: 'center' }} justifyContent={'center'}>
                            <Typography variant="h3" color="primary" align="center">
                              {t(`${SCOPES.MODULES.SIGN_UP}.combo`)}
                            </Typography>
                            <Typography>Hasta el 9/6: $3500</Typography>
                            <Typography>Después del 9/6: $4000</Typography>
                          </Grid>
                          <Grid container justifyContent="flex-end">
                            <Grid item>
                              <Button
                                variant="contained"
                                color="secondary"
                                type="submit"
                                disabled={isSubmitting}
                              >
                                {t(`${SCOPES.MODULES.SIGN_UP}.signUp`)}
                              </Button>
                            </Grid>
                          </Grid>
                          <Grid item style={{ textAlign: 'center' }}>
                            <Typography variant="caption">
                              {t(`${SCOPES.MODULES.SIGN_UP}.disclaimer`)}
                              <b>martes 28 de junio</b>.<br />
                              {t(`${SCOPES.MODULES.SIGN_UP}.disclaimer2`)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Grid>
            )}
          </Container>
        </>
      )}
    </Translation>
  );
}
