/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Grid, Box, Typography, Chip, Icon, Modal } from '@mui/material';
import WithAuthentication from 'modules/withAuthentication';
import { Translation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { Field, Form, Formik } from 'formik';
import TextField from '@mui/material/TextField';
import { date, object, string } from 'yup';
import { createOrUpdateDoc } from 'helpers/firestore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'App';
import { getEvent } from 'helpers/firestore/events';
import { EtiEvent } from 'shared/etiEvent';
import { UserRoles } from 'shared/User';
import { ETIDatePicker } from './form/DatePicker';
import { unassignEventAdmin } from 'helpers/firestore/users';
import { makeStyles } from '@mui/styles';
import { ETITimePicker } from 'components/form/TimePicker';
import InputAdornment from '@mui/material/InputAdornment';
import CloudinaryUploadWidget from 'components/CloudinaryUploadWidget';
import { Cloudinary } from '@cloudinary/url-gen';
import * as firestoreUserHelper from 'helpers/firestore/users';
import { getDocument } from 'helpers/firestore';
import { useParams } from 'react-router-dom';
import { UserFullData } from 'shared/User';

export default function ETICombos(props: { proPackage: string }) {
  const { proPackage } = props;
  const alertText: string = 'Este campo no puede estar vaci­o';

  const EventFormSchema = object({
    dateStart: date()
      .nullable()
      .transform((originalValue) => {
        const parsedDate = new Date(originalValue);
        return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
      })
      .required(alertText),
    dateEnd: date()
      .nullable()
      .when(
        'dateStart',
        (dateStart, schema) =>
          dateStart && schema.min(dateStart, 'No puede ser menor a la fecha de inicio')
      )
      .required(alertText),
    dateSignupOpen: date()
      .nullable()
      .when(
        'dateStart',
        (dateStart, schema) =>
          dateStart && schema.max(dateStart, 'No puede ser mayor a la fecha de inicio')
      )
      .required(alertText),
    dateSignupEnd: date().nullable().required(alertText),
    timeStart: string().required(alertText),
    timeEnd: string().required(alertText),
    timeSignupOpen: string().required(alertText),
    timeSignupEnd: string().required(alertText),
    name: string().required(alertText)
  });

  const [idNuevo, setIdNuevo] = useState('');
  const [enable, setEnable] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [createEvent, setCreateEvent] = useState(true);
  const [showAdmins, setShowAdmins] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // setCreateEvent(false);
    // if (values || []) {
    //   const newAdmins = values || [];
    //   // setAdmins((prevAdmins) => [...new Set([...prevAdmins, ...newAdmins])]);
    //   setShowAdmins(true);
    // }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (proPackage) {
        const isValidId: RegExp = /^new$|^[\w\d]{20}$/;

        if (proPackage === 'new' || isValidId.test(proPackage)) {
          try {
            const event = await getEvent(proPackage);
            setEvent(event);
            setLoading(false);
            console.log(JSON.stringify(event.city));
          } catch (error) {
            console.error(error);
          }
        } else {
          //navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
        }
      }
    };

    fetchData();
  }, [proPackage]);

  const save = async (values: any, setSubmitting: Function) => {
    try {
      if (proPackage) {
        const validateRuote: RegExp = /^[a-zA-Z0-9]{20,}$/;
        const idV: boolean = validateRuote.test(proPackage);
        const idEvento = await createOrUpdateDoc(
          'events',
          values,
          proPackage === 'new' ? undefined : idV
        );
        setIdNuevo(idEvento);
        setEnable(true);
      }
    } catch (error) {
      console.error(error);
      setEnable(false);
      setSubmitting(false);
    }
  };
  // Make Styles
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#FAFAFA',
    border: '1px solid #000',
    boxShadow: 24,
    borderRadius: 6,
    p: 4,
    overflow: 'auto',
    width: '900px',
    height: '500px'
  };

  const scrollbarStyles = {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#C0E5FF',
      borderRadius: '12px'
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
      boxShadow: '1px 0px 2px 0px #6695B7',
      borderRadius: '12px'
    }
  };

  const useStyles = makeStyles({
    root: {
      '& .MuiFormHelperText-root': {
        margin: '2px 0px 0px 2px'
      },
      '& .MuiOutlinedInput-root': {
        fontFamily: 'inter',
        '& fieldset': {
          borderColor: enable ? '#E68650' : '#FDE4AA',
          borderRadius: '8px',
          borderWidth: '1.5px',
          pointerEvents: 'none'
        },
        '&:hover fieldset ': {
          borderColor: enable ? '#E68650' : '#FDE4AA',
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '&.Mui-focused fieldset': {
          borderColor: enable ? '#E68650' : '#FDE4AA',
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: enable ? '#E68650' : '#FDE4AA'
        }
      }
    }
  });

  const classes = useStyles();

  //   const handleDelete = async (email: string) => {
  //     try {
  //       if (idNuevo) {
  //         await unassignEventAdmin(email, idNuevo);
  //         setAdmins((currentAdmins) => currentAdmins.filter((admin) => admin !== email));
  //       } else {
  //         console.error('idNuevo es undefined. No se puede asignar administrador.');
  //       }
  //     } catch (error) {
  //       console.error('Error al borrar administrador:', error);
  //     } finally {
  //     }
  //   };

  //   const handleCreateEvent = async (values: any) => {
  //     try {
  //       await createOrUpdateDoc('events', values, idNuevo === 'new' ? undefined : idNuevo);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  // Add Cloudinary

  const [publicId, setPublicId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageEvent, setImageEvent] = useState('');
  const [inputActive, setActiveInput] = useState(false);

  const cloudNameCredencial = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const cloudPresetCredencial = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  const cloudName = cloudNameCredencial;
  const uploadPreset = cloudPresetCredencial;

  const uwConfig = {
    cloudName,
    uploadPreset
  };

  const cld = new Cloudinary({
    cloud: {
      cloudName
    }
  });

  // Add Combos

  const [event, setEvent] = useState<EtiEvent>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [users, setUsers] = useState<UserFullData[]>([]);
  const [usuarios, setUsuarios] = useState<UserFullData[]>([]);
  const [adminsData, setAdminsData] = useState<{ id: string; fullName: string }[]>([]);
  const [IsLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const eventExists = await getDocument(`events/${id}`);
        if (eventExists) {
          const event = await getEvent(id);
          setEvent(event);
        }
      } else {
        //navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
      }
      setLoading(false);
    };
    fetchData().catch((error) => {
      console.log(error);

      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    setIsLoading(true);

    let unsubscribe: Function;
    let usuarios2: Function;

    const fetchData = async () => {
      unsubscribe = await firestoreUserHelper.getAdmins(setUsers, setIsLoading, proPackage);
      usuarios2 = await firestoreUserHelper.getAllUsers(setUsuarios, setIsLoading);
    };

    fetchData().catch((error) => {
      console.error(error);
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (usuarios2) {
        usuarios2();
      }
    };
  }, [proPackage]);

  useEffect(() => {
    if (event && event.admins && users.length > 0) {
      const adminsArray: { id: string; fullName: string }[] = [];
      event.admins.forEach((element: string) => {
        users.forEach((user) => {
          if (element === user.id) {
            adminsArray.push({
              id: user.id,
              fullName: `${user.nameFirst} ${user.nameLast}`
            });
          }
        });
      });
      setAdminsData(adminsArray);
    }
  }, [event, users]);

  const styleModal = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#FAFAFA',
    border: '1px solid #000',
    boxShadow: 24,
    borderRadius: 6,
    p: 4,
    overflow: 'auto',
    width: '900px',
    height: '500px',
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

            <Box
              sx={{
                display: 'flex'
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  {/**Validations */}
                  <Formik
                    enableReinitialize
                    initialValues={{
                      dateEnd: event?.dateEnd || '',
                      dateSignupOpen: event?.dateSignupOpen || '',
                      dateStart: event?.dateStart || '',
                      dateSignupEnd: event?.dateSignupEnd || '',
                      timeStart: event?.timeStart || '',
                      timeEnd: event?.timeEnd || '',
                      timeSignupOpen: event?.timeSignupOpen || '',
                      timeSignupEnd: event?.timeSignupEnd || ''
                    }}
                    validationSchema={EventFormSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                      console.log('values aqui ->', values);
                      await save(values, setSubmitting);
                    }}
                  >
                    {({ setFieldValue, touched, errors, values }) => (
                      <Form>
                        {/**Section Combos */}
                        <Grid container gap={2}>

                          <Typography sx={{ color: '#424242', fontWeight: 500, fontSize: '20px' }}>
                            Combos
                          </Typography>
                          <Grid item md={12} sm={12} xs={12}>
                            <Grid container gap={2} sx={{ border: '1.5px solid #E68650', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }} >
                              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <Chip label='milonga' variant="outlined" sx={{ m: 1, borderRadius: '8px', color: '#A82548', fontFamily: 'Roboto', fontWeight: 500, fontSize: '14px' }} />
                              </Box>
                              <Button sx={{ padding: '12px, 16px, 12px, 16px', alignItems: 'flex-end' }} onClick={handleOpen}>
                                <Icon sx={{ display: 'flex', width: '4em' }}>
                                  <Typography sx={{ mr: 1, color: '#A82548', fontFamily: 'Roboto', fontWeight: 500 }}>
                                    Añadir
                                  </Typography>
                                  <img src='/img/icon/bag-tick-2.svg' height={25} width={25} />
                                </Icon>
                              </Button>
                            </Grid>
                            <Modal open={open} onClose={() => handleClose()}>
                              <Box sx={{ ...styleModal, display: 'flex', flexDirection: 'column' }}>
                                <h1>Modal</h1>
                              </Box>
                            </Modal>
                          </Grid>

                          {/**Dates */}
                          <Grid item md={12} sm={12} xs={12}>
                            <Typography sx={{ color: '#424242', fontWeight: 500 }}>
                              Primera fecha de pago
                            </Typography>
                            <Grid container alignItems={'flex-start'}>
                              <Grid>
                                {/**Add icons */}
                                <Field
                                  name="name"
                                  placeholder="10000"
                                  component={TextField}
                                  required
                                  fullWidth
                                  classes={{ root: classes.root }}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <img src="/img/icon/dollar.svg" alt="dollar" />
                                      </InputAdornment>
                                    )
                                  }}
                                />
                              </Grid>
                              <Typography
                                sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}
                              >
                                abonando hasta el
                              </Typography>
                              <Grid item>
                                {/**Add icons */}
                                <ETIDatePicker
                                  textFieldProps={{ fullWidth: true }}
                                  fieldName="dateSignupEnd"
                                  setFieldValue={setFieldValue}
                                  borderColor={enable}
                                  specialCase={false}
                                />
                              </Grid>
                              <Typography
                                sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}
                              >
                                a las
                              </Typography>
                              <Grid item>
                                <ETITimePicker
                                  textFieldProps={{ fullWidth: true }}
                                  fieldName="timeSignupOpen"
                                  setFieldValue={setFieldValue}
                                  borderColor={enable}
                                  specialCase={false}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item md={12} sm={12} xs={12}>
                            <Typography sx={{ color: '#424242', fontWeight: 500 }}>
                              Segunda fecha de pago
                            </Typography>
                            <Grid container alignItems={'flex-start'}>
                              <Grid>
                                <Field
                                  name="name"
                                  placeholder="10000"
                                  component={TextField}
                                  required
                                  fullWidth
                                  classes={{ root: classes.root }}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <img src="/img/icon/dollar.svg" alt="dollar" />
                                      </InputAdornment>
                                    )
                                  }}
                                />
                              </Grid>
                              <Typography
                                sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}
                              >
                                abonando hasta el
                              </Typography>
                              <Grid item>
                                <ETIDatePicker
                                  textFieldProps={{ fullWidth: true }}
                                  fieldName="dateSignupEnd"
                                  setFieldValue={setFieldValue}
                                  borderColor={enable}
                                  specialCase={false}
                                />
                              </Grid>
                              <Typography
                                sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}
                              >
                                a las
                              </Typography>
                              <Grid item>
                                <ETITimePicker
                                  textFieldProps={{ fullWidth: true }}
                                  fieldName="timeSignupOpen"
                                  setFieldValue={setFieldValue}
                                  borderColor={enable}
                                  specialCase={false}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item md={12} sm={12} xs={12}>
                            <Typography sx={{ color: '#424242', fontWeight: 500 }}>
                              Fecha limites para devoluciones
                            </Typography>
                            <Grid container alignItems={'flex-start'}>
                              <Grid item>
                                <ETIDatePicker
                                  textFieldProps={{ fullWidth: true }}
                                  fieldName="dateSignupEnd"
                                  setFieldValue={setFieldValue}
                                  borderColor={enable}
                                  specialCase={false}
                                />
                              </Grid>
                              <Typography
                                sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}
                              >
                                hasta las
                              </Typography>
                              <Grid item>
                                <ETITimePicker
                                  textFieldProps={{ fullWidth: true }}
                                  fieldName="timeSignupOpen"
                                  setFieldValue={setFieldValue}
                                  borderColor={enable}
                                  specialCase={false}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item md={12} sm={12} xs={12}>
                            <Typography sx={{ color: '#424242', fontWeight: 500 }}>
                              Limite de participantes
                            </Typography>
                            <Grid container alignItems={'flex-start'}>
                              <Grid>
                                {/**Add icons */}
                                <Field
                                  name="name"
                                  placeholder="10000"
                                  component={TextField}
                                  required
                                  fullWidth
                                  classes={{ root: classes.root }}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <img src="/img/icon/people.svg" alt="people" />
                                      </InputAdornment>
                                    )
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          {/**Front Page, buttons and Cloudinary*/}
                          <Grid>
                            <Typography
                              sx={{ color: '#212121', fontWeight: 500, fontSize: '20px' }}
                            >
                              Portada
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container alignItems="flex-start">
                          {/** Add Cloudinary  */}
                          <Box
                            sx={{
                              maxHeight: '300px',
                              maxWidth: '50%',
                              marginTop: '20px',
                              width: '100%',
                              overflow: 'auto'
                            }}
                          >
                            <Box
                              component="img"
                              sx={{
                                height: 550,
                                width: 450,
                                maxHeight: { xs: 550, md: 190 },
                                maxWidth: { xs: 450, md: 360 }
                              }}
                              alt="Imagen representativa del evento"
                              src={imageEvent ? imageEvent : '/img/imageNotFound.png'}
                            />

                            {/* <CloudinaryUploadWidget
                              uwConfig={uwConfig}
                              setPublicId={setPublicId}
                              onImageUpload={(uploadedImageUrl: string) =>
                                setImageUrl(uploadedImageUrl)
                              }
                            /> */}
                          </Box>
                          {/** Add Buttons */}
                          <Grid item>
                            {/** Button to add cover */}
                            <Button
                              variant="contained"
                              color="secondary"
                              type="submit"
                              disabled={enable}
                              sx={{
                                width: '150px',
                                padding: '12px, 32px, 12px, 32px',
                                borderRadius: '12px',
                                marginTop: '80px',
                                backgroundColor: enable ? '#CCCCCC' : '#A82548',
                                height: '44px',
                                '&:hover': { backgroundColor: enable ? '#CCCCCC' : '#A82548' }
                              }}
                            >
                              <Typography
                                sx={{
                                  color: '#FAFAFA',
                                  fontWeight: 500,
                                  fontSize: '10px',
                                  lineHeight: '10px'
                                }}
                              >
                                Subir nueva portada
                              </Typography>
                            </Button>
                          </Grid>
                          <Grid item>
                            {/** Button to delete cover */}
                            <Button
                              variant="contained"
                              color="secondary"
                              type="submit"
                              disabled={enable}
                              sx={{
                                width: '115px',
                                padding: '12px, 32px, 12px, 32px',
                                borderRadius: '12px',
                                marginTop: '80px',
                                backgroundColor: enable ? '#ffffff' : '#ffffff',
                                height: '44px',
                                '&:hover': { backgroundColor: enable ? '#ffffff' : '#ffffff' }
                              }}
                            >
                              <Typography
                                sx={{
                                  color: '#A82548',
                                  fontWeight: 500,
                                  fontSize: '14px',
                                  lineHeight: '20px'
                                }}
                              >
                                Eliminar
                              </Typography>
                            </Button>
                          </Grid>
                        </Grid>
                      </Form>
                    )}
                  </Formik>
                </Grid>
              </Grid>
            </Box>

          )}
        </>
      )}
    </Translation>
  );
}
