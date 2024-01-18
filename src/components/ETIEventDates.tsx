/* eslint-disable prettier/prettier */
import { Box, Button, Chip, Grid, Modal, Typography } from "@mui/material";
import { Field, Form, Formik } from 'formik';
import { createOrUpdateDoc } from "helpers/firestore";
import { useContext, useEffect, useState } from "react";
import { EtiEvent } from "shared/etiEvent";
import { date, object, string } from 'yup';
import { LocationPicker } from "./form/LocationPicker";
import { ETIDatePickerEdit } from "./form/DatePickerEdit";
import { ETITimePickerEdit } from "./form/TimePickerEdit";
import { UserContext } from "helpers/UserContext";
import { isAdmin, isSuperAdmin } from "helpers/firestore/users";
import { TextField } from 'formik-mui';
import { makeStyles } from '@mui/styles';
import { UserFullData } from "shared/User";
import * as firestoreUserHelper from 'helpers/firestore/users';
import RolesNewEvent from "modules/superAdmin/roles/RolesNewEvent";
import { assignEventAdmins, unassignEventAdmins } from '../helpers/firestore/users';

interface Admin {
  name: string;
  email: string;
}
export default function ETIEventDate({ selectedEvent, changeEvent }: { selectedEvent: EtiEvent | null, changeEvent: Function }) {
  const idEvent = selectedEvent?.id
  const [event, setEvent] = useState<EtiEvent>();
  const { user } = useContext(UserContext)
  const userIsAdmin = isAdmin(user)
  const userIsSuperAdmin = isSuperAdmin(user)
  const [enable, setEnable] = useState(false)
  const alertText: string = 'Este campo no puede estar vacío';
  const EventFormSchema = object({
    dateEnd: date().required(alertText),
    dateSignupOpen: date().required(alertText),
    dateStart: date().required(alertText),
    location: string().required(alertText),
    name: string().required(alertText),
    country: string().nullable(true).required(alertText),
    province: string()
      .nullable(true)
      .when('country', {
        is: 'Argentina',
        then: string().nullable(true).required(alertText)
      }),
    city: string()
      .nullable(true)
      .when('country', {
        is: 'Argentina',
        then: string().nullable(true).required(alertText)
      }),
  });
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<UserFullData[]>([]);
  const [IsLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminsToDelete, setAdminsToDelete] = useState<string[]>([]);
  const handleOpen = () => setOpen(true);
  const handleClose = (values: string[] | null) => {
    setOpen(false)
    if (values && values.length > 0) {
      setAdmins((prevAdmins: any) => {
        const uniqueNewAdmins = values.filter((newAdmin: any) => !prevAdmins.some((admin: any) => admin.email === newAdmin.email));
        const combinedAdmins = [...prevAdmins, ...uniqueNewAdmins];
        const uniqueAdmins = combinedAdmins.filter((admin: any, index, self) => self.findIndex((a: any) => a.email === admin.email) === index);
        return uniqueAdmins;
      });
    }
  };
  useEffect(() => {
    setIsLoading(true);

    let unsubscribe: Function;
    let usuarios2: Function;

    const fetchData = async () => {
      unsubscribe = await firestoreUserHelper.getAdmins(setUsers, setIsLoading, idEvent);
      // usuarios2 = await firestoreUserHelper.getAllUsers(setUsuarios, setIsLoading)

    };

    fetchData().catch((error) => {
      console.error(error);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      } if (usuarios2) {
        usuarios2()
      }
    };
  }, []);

  useEffect(() => {
    if (selectedEvent && selectedEvent.admins && users.length > 0) {
      const adminsArray: { name: string; email: string }[] = [];
      selectedEvent.admins.forEach((element: string) => {
        users.forEach((user: any) => {
          if (element === user.id) {
            adminsArray.push({
              name: `${user.nameFirst} ${user.nameLast}`,
              email: user.email,
            })
          }
        });
      });
      setAdmins(adminsArray)
    }
  }, [selectedEvent]);



  const handleDelete = (email: string) => {
    try {
      setAdminsToDelete((prevAdminsToDelete) => [...prevAdminsToDelete, email]);
      setAdmins((currentAdmins) => currentAdmins.filter((admin: any) => admin.email !== email));
    } catch (error) {
      console.error('Error al borrar administrador:', error);
    } finally {
      // setLoading(false);
    }
  };


  const handleEditDataEvent = async (values: any) => {
    try {
      if (enable === false) {
        setEnable(true)
        changeEvent(true)
      } else {
        if (idEvent) {
          const selectedEmails = admins.map((admin: any) => admin.email);
          if (selectedEmails.length === 0) {
            if (admins.length === 0) {
              throw new Error('Tienes que seleccionar al menos un admin.');
            }
          }
          await createOrUpdateDoc('events', values, idEvent === 'new' ? undefined : idEvent);
          const emailsToDelete = adminsToDelete.filter((email) => !selectedEmails.includes(email));
          await unassignEventAdmins(emailsToDelete, idEvent);

          await assignEventAdmins(selectedEmails, idEvent);
          setEnable(false)
          changeEvent(false)
        }
      }
    } catch (error) {
      console.log('Tienes que seleccionar al menos un admin.');
    }
  }

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

  const useStyles = makeStyles({
    root: {
      '& .MuiFormHelperText-root': {
        margin: '2px 0px 0px 2px'
      },
      '& .MuiOutlinedInput-root': {
        fontFamily: 'inter',
        padding: '12px 16px 12px 16px',
        height: '42px',
        '& fieldset': {
          borderRadius: '8px',
          borderWidth: '1.5px',
          pointerEvents: 'none'
        },
        '&:hover fieldset ': {
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '&.Mui-focused fieldset': {
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#FDE4AA',
        }
      },
    },
    filled: {
      '& .MuiOutlinedInput-root': {
        padding: '12px 16px 12px 16px',
        height: '42px',
        '& fieldset': {
          borderColor: '#E68650',
        },
        '&:hover fieldset ': {
          borderColor: '#E68650',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#E68650',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#E68650',
        }
      },
    },
  });

  const classes = useStyles()

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          dateEnd: selectedEvent?.dateEnd || '',
          dateSignupOpen: selectedEvent?.dateSignupOpen || '',
          dateStart: selectedEvent?.dateStart || '',
          name: selectedEvent?.name || '',
          // country: selectedEvent?.country || '',
          province: selectedEvent?.province || '',
          city: selectedEvent?.city || '',
          admins: selectedEvent?.admins || '',
          timeStart: selectedEvent?.timeStart || '',
          timeEnd: selectedEvent?.timeEnd || '',
          timeSignupOpen: selectedEvent?.timeSignupOpen || '',
          // timeSignupEnd: selectedEvent?.timeSignupEnd || '',
        }}
        validationSchema={EventFormSchema}
        onSubmit={async (values) => {
          await handleEditDataEvent(values);
        }}
      >
        {({ setFieldValue, touched, errors, values }) => (
          <Form>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0px 24px 0px', margin: '0px 20px 0px 20px' }}>
              <Typography sx={{ fontWeight: 600, fontSize: '24px', }}>Información general</Typography>
              <Box sx={{ display: 'flex', mr: 1, alignItems: 'center' }}>
                {userIsSuperAdmin ? <>
                  {!enable && (
                    <Typography sx={{ fontWeight: 600, fontSize: '24px', color: '#0075D9', mr: 1 }}>{selectedEvent?.name}</Typography>
                  )}
                  {enable && (
                      <Field
                        name="name"
                        placeholder={selectedEvent?.name}
                        component={TextField}
                        required
                        fullWidth
                        classes={{ root: values.name ? classes.filled : classes.root }}
                      />
                  )}
                  <Button onClick={() => handleEditDataEvent(values)}>
                    <img src={enable ? '/img/icon/btnConfirm.svg' : '/img/icon/Button_modify.svg'} height={25} width={25} />
                  </Button>
                </> : <Typography sx={{ fontWeight: 600, fontSize: '24px', color: '#0075D9', mr: 1 }}>{selectedEvent?.name}</Typography>}
              </Box>
            </Box>
            <Box sx={{ margin: '0px 20px 0px 20px', backgroundColor: '#FAFAFA', borderRadius: '12px 12px 0px 0px', p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <LocationPicker
                    values={values}
                    errors={errors}
                    t={undefined}
                    setFieldValue={setFieldValue}
                    touched={touched}
                    location={event}
                    borderColor={false}
                    specialCase={true}
                    colorFont={'#0075D9'}
                    fontFamily={'Inter'}
                    fontWeight={400}
                    isDisabled={!enable}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item md={4} sm={4} xs={4}>
                      <Typography style={{ fontFamily: 'inter', color: '#0075D9' }}>
                        Desde
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E68650', borderRadius: 2 }}>
                        <ETIDatePickerEdit
                          textFieldProps={{ fullWidth: true }}
                          fieldName="dateStart"
                          setFieldValue={setFieldValue}
                          borderColor={false}
                          specialCase={true}
                          isDisabled={!enable}
                        />
                        <Box sx={{ width: '100px', ml: 6 }}>
                          <Typography style={{ fontFamily: 'inter', color: '#0075D9', fontSize: '16px' }}>
                            a las
                          </Typography>
                        </Box>
                        <ETITimePickerEdit
                          textFieldProps={{ fullWidth: true }}
                          fieldName="timeStart"
                          setFieldValue={setFieldValue}
                          borderColor={false}
                          specialCase={true}
                        />
                      </Box>
                    </Grid>

                    <Grid item md={4} sm={4} xs={4} >
                      <Typography style={{ fontFamily: 'inter', color: '#0075D9' }}>
                        Hasta
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E68650', borderRadius: 2 }}>
                        <ETIDatePickerEdit
                          textFieldProps={{ fullWidth: true }}
                          fieldName="dateEnd"
                          setFieldValue={setFieldValue}
                          borderColor={false}
                          specialCase={true}
                          isDisabled={!enable}
                        />
                        <Box sx={{ width: '100px', ml: 6 }}>
                          <Typography style={{ fontFamily: 'inter', color: '#0075D9', fontSize: '16px' }}> a las</Typography>
                        </Box>

                        <ETITimePickerEdit
                          textFieldProps={{ fullWidth: true }}
                          fieldName="timeEnd"
                          setFieldValue={setFieldValue}
                          borderColor={false}
                          specialCase={true}
                        />
                      </Box>
                    </Grid>

                    <Grid item md={4} sm={4} xs={4} >
                      <Typography style={{ fontFamily: 'inter', color: '#0075D9' }}>
                        Inscripciones
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E68650', borderRadius: 2 }}>
                        <ETIDatePickerEdit
                          textFieldProps={{ fullWidth: true }}
                          fieldName="dateSignupOpen"
                          setFieldValue={setFieldValue}
                          borderColor={false}
                          specialCase={true}
                          isDisabled={!enable}
                        />
                        <Box sx={{ width: '100px', ml: 6 }}>
                          <Typography style={{ fontFamily: 'inter', color: '#0075D9', fontSize: '16px' }}>a las</Typography>
                        </Box>

                        <ETITimePickerEdit
                          textFieldProps={{ fullWidth: true }}
                          fieldName="timeSignupOpen"
                          setFieldValue={setFieldValue}
                          borderColor={false}
                          specialCase={true}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>


                <Grid item md={12} sm={12} xs={12}>
                  <Grid container gap={2} sx={{ border: '1.5px solid #E68650', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {admins.length === 0 ? (
                        <Typography variant="body2" color="error" sx={{ fontWeight: 500, p: 2 }}>
                          Debes seleccionar al menos un admin.
                        </Typography>
                      ) : (
                        admins.map((admin: any, index) => (
                          <Chip key={index} label={admin.name} {...(enable ? { onDelete: () => handleDelete(admin.email) } : {})} variant="outlined" sx={{ m: 1, borderRadius: '8px', color: '#A82548', fontFamily: 'Roboto', fontWeight: 500, fontSize: '14px' }} />
                        ))
                      )}
                    </Box>
                    {enable &&
                      <Button sx={{ padding: '12px, 16px, 12px, 16px', alignItems: 'flex-end' }} onClick={handleOpen}>
                        <Typography sx={{ mr: 1, color: '#A82548', fontFamily: 'Roboto', fontWeight: 500 }}>
                          Agregar
                        </Typography>
                        <img src='/img/icon/user-cirlce-add.svg' height={25} width={25} />
                      </Button>
                    }
                  </Grid>
                  <Modal open={open} onClose={() => handleClose([])}>
                    <Box sx={{ ...styleModal, display: 'flex', flexDirection: 'column' }}>
                      <RolesNewEvent eventId={idEvent} handleClose={handleClose} />
                    </Box>
                  </Modal>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
}
