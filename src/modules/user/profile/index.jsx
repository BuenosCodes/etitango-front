import React, { useEffect, useState } from 'react';
import { deleteField } from 'firebase/firestore';
import { Button, CircularProgress, Container, Grid, MenuItem, Typography } from '@mui/material';
import WithAuthentication from '../../withAuthentication';
import { auth } from 'etiFirebase';
import { Translation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel, Select, TextField } from 'formik-mui';
import { bool, number, object, string } from 'yup';
import { FoodChoices } from 'shared/signup';
import { createOrUpdateDoc, getDocument } from 'helpers/firestore';
import { LocationPicker } from '../../LocationPicker';
import { USERS } from 'helpers/firestore/users.js';

export default function Profile() {
  const ProfileSchema = object({
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
      })
  });
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

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

  const save = async (values, setSubmitting) => {
    const { nameFirst, nameLast, email, dniNumber, food, isCeliac, country, province, city } =
      values;
    let data = {
      nameFirst,
      nameLast,
      email,
      dniNumber,
      food,
      isCeliac,
      country
    };
    const isArgentina = data.country === 'Argentina';

    data.province = isArgentina ? province : deleteField();
    data.city = isArgentina ? city : deleteField();

    try {
      await createOrUpdateDoc('users', data, auth.currentUser.uid);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      //TODO global error handling this.setState({errors: error.response.data})
    }
  };

  return (
    <Translation
      ns={[SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP, SCOPES.MODULES.PROFILE]}
      useSuspense={false}
    >
      {(t) => (
        <>
          <WithAuthentication redirectUrl={'inscripcion'} />
          {loading ? (
            <CircularProgress />
          ) : (
            <Container maxWidth="lg" sx={{ marginTop: 6 }}>
              <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={3}
              >
                <Grid item sx={{ mb: 3 }}>
                  <Typography variant="h2" color="secondary" align="center">
                    {t(`${SCOPES.MODULES.PROFILE}.title`)}
                  </Typography>
                </Grid>
                <Formik
                  enableReinitialize
                  initialValues={{
                    nameFirst: userData?.nameFirst || '',
                    nameLast: userData?.nameLast || '',
                    dniNumber: userData?.dniNumber || '',
                    food: userData?.food || '',
                    isCeliac: userData.isCeliac,
                    country: userData.country || null,
                    province: userData.province || null,
                    city: userData.city || null,
                    email: auth?.currentUser?.email
                  }}
                  validationSchema={ProfileSchema}
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
                        <Grid item xs={12} lg={12} style={{ display: 'flex' }}>
                          <LocationPicker
                            errors={errors}
                            t={t}
                            setFieldValue={setFieldValue}
                            touched={touched}
                            location={userData}
                          />
                        </Grid>
                        <Grid item container justifyContent={'center'}>
                          <Grid container justifyContent="flex-end">
                            <Grid item>
                              <Button
                                variant="contained"
                                color="secondary"
                                type="submit"
                                disabled={isSubmitting}
                              >
                                {t(`${SCOPES.MODULES.PROFILE}.save`)}
                              </Button>
                            </Grid>
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
