import { useTranslation } from 'react-i18next';
import { SCOPES } from '../../helpers/constants/i18n';
import { bool, date, object, string } from 'yup';
import { createSignup } from '../../helpers/firestore/signups';
import { auth } from '../../etiFirebase.js';
import { ROUTES } from '../../App.js';
import { Field, Form, Formik } from 'formik';
import { Button, Grid, MenuItem, Typography } from '@mui/material';
import { ETIDatePicker } from '../../components/form/DatePicker';
import { Select } from 'formik-mui';
import { SignupFormData, SignupHelpWith } from '../../shared/signup';
import { LocationPicker } from '../../components/form/LocationPicker';
import React from 'react';
import { EtiEvent } from '../../shared/etiEvent';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../../shared/User';

export function SignupForm({
  etiEvent,
  userData,
  isSignedUp
}: {
  etiEvent: EtiEvent;
  userData: UserData;
  isSignedUp: boolean;
}) {
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.SIGN_UP], {
    useSuspense: false
  });

  const navigate = useNavigate();

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
  const save = async (values: SignupFormData, setSubmitting: Function) => {
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
      await createSignup(etiEvent?.id, auth.currentUser!.uid, data);
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
        nameFirst: userData.nameFirst,
        nameLast: userData.nameLast,
        dniNumber: userData.dniNumber,
        // @ts-ignore
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
                  {etiEvent?.prices.map((p, i) => {
                    const { priceHuman, deadlineHuman } = p;
                    return (
                      <Typography key={'prices_' + i}>
                        {priceHuman} hasta el {deadlineHuman} (inclusive)
                      </Typography>
                    );
                  })}
                </Grid>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      disabled={isSignedUp || isSubmitting}
                    >
                      {t(`${SCOPES.MODULES.SIGN_UP}.${'signUp'}`).toUpperCase()}
                    </Button>
                  </Grid>
                </Grid>
                <Grid item style={{ textAlign: 'center' }}>
                  <Typography variant="caption">
                    {t(`${SCOPES.MODULES.SIGN_UP}.disclaimer`)}
                    <b>{etiEvent?.comboReturnDeadlineHuman}</b>.<br />
                    {t(`${SCOPES.MODULES.SIGN_UP}.disclaimer2`)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
}
