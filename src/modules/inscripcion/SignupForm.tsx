import { useTranslation } from 'react-i18next';
import { SCOPES } from '../../helpers/constants/i18n';
import { bool, date, object, string } from 'yup';
import { createSignup } from '../../helpers/firestore/signups';
import { ROUTES } from '../../App.js';
import { Field, Form, Formik } from 'formik';
import { Button, Grid, MenuItem, Typography } from '@mui/material';
import { ETIDatePicker } from '../../components/form/DatePicker';
import { CheckboxWithLabel, Select } from 'formik-mui';
import { SignupFormData, SignupHelpWith } from '../../shared/signup';
import { LocationPicker } from '../../components/form/LocationPicker';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../helpers/UserContext';
import { ComboPricingDisplay } from '../components/ComboPricingDisplay';
import { EtiEventContext } from '../../helpers/EtiEventContext';

export function SignupForm() {
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP], {
    useSuspense: false
  });
  const { user } = useContext(UserContext);
  const { data: userData } = user;
  const { etiEvent } = useContext(EtiEventContext);
  const navigate = useNavigate();

  const SignupSchema = object({
    helpWith: string().required('Este campo no puede estar vacío'),
    food: string().required('Este campo no puede estar vacío'),
    isCeliac: bool().required('Este campo no puede estar vacío'),
    wantsLodging: bool(),
    country: string().required('Este campo no puede estar vacío'),
    province: string().when('country', {
      is: 'Argentina',
      then: (schema) => schema.required('Este campo no puede estar vacío')
      //string().required('Este campo no puede estar vacío')
    }),
    city: string().when('country', {
      is: 'Argentina',
      then: (schema) => schema.required('Este campo no puede estar vacío')
    }),
    dateArrival: date().required('Este campo no puede estar vacío'),
    dateDeparture: date().required('Este campo no puede estar vacío')
  });
  const save = async (values: SignupFormData, setSubmitting: Function) => {
    const {
      dateArrival,
      dateDeparture,
      helpWith,
      food,
      isCeliac,
      country,
      province,
      city,
      wantsLodging
    } = values;

    let data = {
      dateArrival,
      dateDeparture,
      helpWith,
      food,
      isCeliac,
      country,
      province,
      city,
      wantsLodging
    };
    try {
      await createSignup(etiEvent?.id, user.uid, data);
      navigate(ROUTES.SIGNUPS);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      //TODO global error handling this.setState({errors: error.response.data})
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        nameFirst: userData?.nameFirst,
        nameLast: userData?.nameLast,
        birthDate: userData?.birthDate,
        dniNumber: userData?.dniNumber,
        // @ts-ignore
        helpWith: '',
        // @ts-ignore
        food: userData?.food,
        // @ts-ignore
        isCeliac: userData?.isCeliac,
        // @ts-ignore
        country: userData?.country,
        province: userData?.province,
        city: userData?.city,
        dateArrival: etiEvent?.dateStart,
        dateDeparture: etiEvent?.dateEnd,
        email: user.email,
        wantsLodging: false
      }}
      validationSchema={SignupSchema}
      onSubmit={async (values: SignupFormData, { setSubmitting }) => {
        await save(values, setSubmitting);
      }}
    >
      {({ isSubmitting, touched, errors, setFieldValue, values }) => {
        return (
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
              <Grid item md={4} sm={4} xs={12}>
                <ETIDatePicker
                  label={t('birthDate')}
                  fieldName="birthDate"
                  setFieldValue={setFieldValue}
                  textFieldProps={{ fullWidth: true }}
                />
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
              {etiEvent?.lodgingCapacity ? (
                <Grid item md={6} sm={12} xs={12}>
                  <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name="wantsLodging"
                    Label={{ label: t('wantsLodging') }}
                  />
                </Grid>
              ) : null}
              <Grid item container justifyContent={'center'}>
                <ComboPricingDisplay />
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {t(`${SCOPES.MODULES.SIGN_UP}.${'signUp'}`).toUpperCase()}
                    </Button>
                  </Grid>
                </Grid>
                <Grid item style={{ textAlign: 'center' }}>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
}
