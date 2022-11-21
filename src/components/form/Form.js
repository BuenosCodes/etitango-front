import React from 'react';
import { Formik, Form, Field } from 'formik';
import { object, ref, string, number } from 'yup';
import {
  Avatar,
  Button,
  CssBaseline,
  Grid,
  Box,
  Typography,
  Container,
  LinearProgress
} from '@mui/material';
import { TextField } from 'formik-mui';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const UserSchema = object({
  name: string().required('Completa este campo'),
  surname: string().required('Completa este campo'),
  dni: number()
    .required('Completa este campo')
    .positive()
    .typeError('El DNI debe contener números únicamente'),
  email: string().required('Completa este campo').email('Mail inválido'),
  password: string()
    .required('Completa este campo')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número'
    ),
  passwordConfirmation: string().oneOf([ref('password'), null], 'Las contraseñas no coinciden')
});

function Register() {
  const onUserRegistration = (values, { setSubmitting }) => {
    setSubmitting(false);
    alert('Usuario registrado!');
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Formulario de registro
        </Typography>
        <Formik
          initialValues={{
            name: '',
            surname: '',
            dni: '',
            password: '',
            email: ''
          }}
          validationSchema={UserSchema}
          onSubmit={onUserRegistration}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={6}>
                    <Field name="name" label="Nombre" component={TextField} required />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Field name="surname" label="Apellido" component={TextField} required />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="email"
                      type="email"
                      label="Email"
                      component={TextField}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field name="dni" label="DNI" component={TextField} fullWidth required />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="password"
                      type="password"
                      label="Contraseña"
                      component={TextField}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="passwordConfirmation"
                      type="password"
                      label="Repetir contraseña"
                      component={TextField}
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Registrarse
                </Button>
                {isSubmitting && <LinearProgress />}
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}

export default Register;
