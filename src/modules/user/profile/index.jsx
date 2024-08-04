import React, { useContext, useEffect, useState } from 'react';
import { deleteField } from 'firebase/firestore';
import { Button, CircularProgress, Container, Grid, MenuItem } from '@mui/material';
import WithAuthentication from '../../withAuthentication';
import { auth } from 'etiFirebase';
import { Translation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel, Select, TextField } from 'formik-mui';
import { bool, number, object, string } from 'yup';
import { DanceRoles, FoodChoices } from 'shared/signup';
import { createOrUpdateDoc, getDocument } from 'helpers/firestore';
import { LocationPicker } from '../../../components/form/LocationPicker.tsx';
import { USERS } from 'helpers/firestore/users';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../App.js';
import { BANKS } from 'helpers/firestore/banks';
import { ERROR_CODES } from '../../../helpers/constants/errorCodes.ts';
import { NotificationContext } from '../../../helpers/NotificationContext.ts';
import { validateSignUp } from '../../../helpers/firestore/signups.ts';
import { t } from 'i18next';
import { EtiEventContext } from '../../../helpers/EtiEventContext';

export default function Profile() {
  const ProfileSchema = object({
    nameFirst: string().required('Este campo no puede estar vacío'),
    nameLast: string().required('Este campo no puede estar vacío'),
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
    role: string().required('Este campo no puede estar vacío'),
    isCeliac: bool().required('Este campo no puede estar vacío'),
    phoneNumber: number()
      .required('Completa este campo')
      .positive()
      .typeError('El teléfono debe contener números únicamente')
      .test(
        'phone_number',
        'El teléfono debe tener al menos 10 dígitos',
        (value) => !value || (value && value.toString().length >= 10)
      ),

    country: string().nullable().required('Este campo no puede estar vacío'),
    province: string().when('country', {
      is: 'Argentina',
      then: (schema) => schema.required('Este campo no puede estar vacío'),
      otherwise: (schema) => schema.nullable()
    }),
    city: string().when('country', {
      is: 'Argentina',
      then: (schema) => schema.required('Este campo no puede estar vacío'),
      otherwise: (schema) => schema.nullable()
    }),
    bank: string().required(
      'Este campo no puede estar vacío. Es necesario para gestionar la devolución de tu combo y para resolver problemas con el pago'
    ),
    disability: string()
  });

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPendingSignup, setIsPendingSignup] = useState(false);

  const { setNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const { etiEvent } = useContext(EtiEventContext);
  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser?.uid) {
        const [user, bank] = await Promise.all([
          getDocument(`${USERS}/${auth.currentUser.uid}`),
          getDocument(`${BANKS}/${auth.currentUser.uid}`)
        ]);
        setUserData({ ...user, bank: bank?.bank });
        setLoading(false);
      }
    };
    fetchData().catch((error) => console.error(error));
  }, [auth.currentUser?.uid]);

  const save = async (values, setSubmitting) => {
    const {
      nameFirst,
      nameLast,
      email,
      dniNumber,
      food,
      isCeliac,
      country,
      province,
      city,
      role,
      bank,
      disability,
      phoneNumber
    } = values;
    let userData = {
      lastModifiedAt: new Date(),
      nameFirst,
      nameLast,
      email,
      dniNumber,
      food,
      isCeliac,
      country,
      role,
      disability,
      phoneNumber
    };
    const isArgentina = userData.country === 'Argentina';

    userData.province = isArgentina ? province : deleteField();
    userData.city = isArgentina ? city : deleteField();

    const userId = auth.currentUser.uid;
    try {
      await Promise.all([
        createOrUpdateDoc('users', userData, userId),
        createOrUpdateDoc('banks', { userId, bank }, userId)
      ]);
      navigate(ROUTES.USER_HOME);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      //TODO global error handling this.setState({errors: error.response.userData})
    }
  };

  const handleError = (error) => {
    if (error.code === ERROR_CODES.SIGNUPS.ALREADY_SIGNED_UP) {
      setIsPendingSignup(true);
      setNotification(t(`${SCOPES.MODULES.PROFILE}.alreadySignedUpReason`), { severity: 'info' });
    }
  };

  useEffect(() => {
    const getFormData = async () => {
      if (etiEvent?.id) {
        await validateSignUp(etiEvent.id);
      }
    };
    getFormData().catch(handleError);
  }, []);

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
            <Container maxWidth="lg" sx={{ marginTop: 3 }}>
              <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={3}
              >
                <Grid item sx={{ my: 3, typography: 'h5', color: 'secondary.main' }}>
                  {t(`${SCOPES.MODULES.PROFILE}.title`)}
                </Grid>
                <Formik
                  enableReinitialize
                  initialValues={{
                    nameFirst: userData?.nameFirst || '',
                    nameLast: userData?.nameLast || '',
                    dniNumber: userData?.dniNumber || '',
                    food: userData?.food || '',
                    role: userData?.role || '',
                    isCeliac: userData.isCeliac || false,
                    country: userData.country || null,
                    province: userData.province || null,
                    city: userData.city || null,
                    email: auth?.currentUser?.email,
                    bank: userData.bank || '',
                    phoneNumber: userData.phoneNumber || '',
                    disability: userData.disability || ''
                  }}
                  validationSchema={ProfileSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    await save(values, setSubmitting);
                  }}
                >
                  {({ isSubmitting, touched, errors, setFieldValue, values }) => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item md={6} sm={6} xs={12}>
                          <Field
                            name="nameFirst"
                            label={t('nameFirst')}
                            component={TextField}
                            required
                            fullWidth
                            disabled={isPendingSignup}
                          />
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                          <Field
                            name="nameLast"
                            label={t('nameLast')}
                            component={TextField}
                            required
                            fullWidth
                            disabled={isPendingSignup}
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
                            name="phoneNumber"
                            label={t('phoneNumber')}
                            component={TextField}
                            required
                            fullWidth
                          />
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                          <Field
                            name="dniNumber"
                            label={t('dniNumber')}
                            component={TextField}
                            required
                            fullWidth
                            disabled={isPendingSignup}
                          />
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                          <Field
                            name="disability"
                            label={t('disability')}
                            component={TextField}
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
                          <Field
                            component={CheckboxWithLabel}
                            type="checkbox"
                            name="isCeliac"
                            Label={{ label: t('isCeliac') }}
                          />
                        </Grid>

                        <Grid item xs={12} lg={12} style={{ display: 'flex' }}>
                          <LocationPicker
                            values={values}
                            errors={errors}
                            t={t}
                            setFieldValue={setFieldValue}
                            touched={touched}
                            location={userData}
                          />
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                          <Field
                            component={Select}
                            id="role"
                            name="role"
                            labelId="role-label"
                            label={t('role')}
                            formControl={{ fullWidth: true }}
                          >
                            {Object.values(DanceRoles).map((role) => (
                              <MenuItem key={role} value={role}>
                                {t(role) || role}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                          <Field
                            name="bank"
                            label="CBU/alias"
                            component={TextField}
                            required
                            fullWidth
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
                                {t(`${SCOPES.MODULES.PROFILE}.save`).toUpperCase()}
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
