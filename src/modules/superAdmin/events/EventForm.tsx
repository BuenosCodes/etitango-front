/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { CircularProgress, Grid, Box, Typography, Modal, Chip } from '@mui/material';
import WithAuthentication from '../../withAuthentication';
import { Translation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { Form, Formik } from 'formik';
import { date, object, string } from 'yup';
import { createOrUpdateDoc } from 'helpers/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../App.js';
import { EtiEvent } from '../../../shared/etiEvent';
import { UserRoles } from '../../../shared/User';
import RolesNewEvent from '../roles/RolesNewEvent';
import { ETITimePicker } from 'components/form/EtiTimePicker';
import { assignEventAdmins } from '../../../helpers/firestore/users';
import { styles } from './EventForm.styles';
import EtiButton from 'components/button/EtiButton';
import { TextFieldForm } from 'components/form/TextFieldForm';
import { ETIDatePicker } from 'components/form/DatePicker';
import { EtiLocationPicker } from 'components/form/EtiLocationPicker';
import { AddButton } from 'components/button/AddButton';
import { useTranslation } from 'react-i18next';

export default function EventForm() {
  const { id } = useParams();
  const { t } = useTranslation([SCOPES.MODULES.ETI], {
    useSuspense: false
  });
  const navigate = useNavigate()
  const EventFormSchema = object({
    dateStart: date().nullable().transform((originalValue) => { const parsedDate = new Date(originalValue); return isNaN(parsedDate.getTime()) ? undefined : parsedDate; }).required(t('errors.alertText')),
    dateEnd: date().nullable().when('dateStart', (dateStart, schema) => (dateStart && schema.min(dateStart, t('errors.dateEnd')))).required(t('errors.alertText')),
    dateSignupOpen: date().nullable().when('dateStart', (dateStart, schema) => {
      if (dateStart) {
        const dateStartEqual = new Date(dateStart.getTime() - 1);
        return schema.max(dateStartEqual, t('errors.dateSignupOpen'));
      }
      return schema;
    }).required(t('errors.alertText')),
    dateSignupEnd: date()
      .nullable()
      .when('dateStart', (dateStart, schema) => {
        if (dateStart) {
          const dateStartEqual = new Date(dateStart.getTime() - 1);
          return schema.max(dateStartEqual, t('errors.dateSignupOpen'));
        }
        return schema;
      })
      .when('dateSignupOpen', (dateSignupOpen, schema) => (dateSignupOpen && schema.min(dateSignupOpen, t('errors.dateSignupEnd') )))
      .required(t('errors.alertText')),
    timeStart: string().required(t('errors.alertText')),
    timeEnd: string().required(t('errors.alertText')),
    timeSignupOpen: string().required(t('errors.alertText')),
    timeSignupEnd: string().required(t('errors.alertText')),
    name: string().required(t('errors.alertText')),
    province: string()
      .nullable(true)
      .when('country', {
        is: 'Argentina',
        then: string().nullable(true).required(t('errors.alertText'))
      }),
    city: string()
      .nullable(true)
      .when('country', {
        is: 'Argentina',
        then: string().nullable(true).required(t('errors.alertText'))
      }),
  });
  const [event] = useState<EtiEvent>();
  const [loading] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = React.useState(false);
  const [admins, setAdmins] = useState<string[]>([]);
  const handleOpen = () => setOpen(true);
  const handleClose = (values: string[] | null) => {
    setOpen(false)
    if (values && values.length > 0) {
      setAdmins((prevAdmins) => {
        const uniqueNewAdmins = values.filter((newAdmin: any) => !prevAdmins.some((admin: any) => admin.email === newAdmin.email));
        const combinedAdmins = [...prevAdmins, ...uniqueNewAdmins];
        const uniqueAdmins = combinedAdmins.filter((admin: any, index, self) => self.findIndex((a: any) => a.email === admin.email) === index);
        return uniqueAdmins;
      });
    }
  };

  const handleDelete = (email: string) => {
    try {
      setAdmins((currentAdmins) => currentAdmins.filter((admin: any) => admin.email !== email));
    } catch (error) {
      alert('Error deleting admin:' + error);
    }
  };

  const handleCreateEvent = async (values: any, setSubmitting: Function) => {
    try {
      setIsLoading(true)
      if (id) {
        const selectedEmails = admins.map((admin: any) => admin.email);
        const validateRuote: RegExp = /^[a-zA-Z0-9]{20,}$/;
        const idV: boolean = validateRuote.test(id);
        const idEvento = await createOrUpdateDoc('events', values, id === 'new' ? undefined : idV);
        await assignEventAdmins(selectedEmails, idEvento);
        setIsLoading(false);
        navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`);
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      alert(error);
      setIsLoading(false)
      setSubmitting(false);
    }
  }

  return (
    <Translation
      ns={[SCOPES.MODULES.ETI]}
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
            <Box sx={{ ...styles.mainContainer }}>
              <Box sx={{ ...styles.titleContainer }}>
              {t('placeholders.name')}
              </Box>

              <Box sx={{display: 'flex', ...styles.scrollbarStyles }}>
                <Grid container>
                  <Grid item xs={12}>
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
                        timeSignupEnd: event?.timeSignupEnd || '',
                        location: event?.location || null,
                        name: event?.name || '',
                        combos: event?.combos || ['Dos Milongas', 'Asamblea Etiana', 'Comida de despedida'],
                        admins: event?.admins || []
                      }}
                      validationSchema={EventFormSchema}
                      onSubmit={async (values, { setSubmitting }) => {
                        await handleCreateEvent(values, setSubmitting);
                      }}
                    >
                      {({ setFieldValue, touched, errors, values, isSubmitting }) => (
                        <Form>
                          <Box sx={{ ...styles.newEtiContainer }}>

                            <Grid container gap={2}>
                              <Typography typography={{xs:'label.mobile', md: 'label.desktop'}} sx={{ color: 'greyScale.800' }}>{t('label.name')}</Typography>
                              <Grid item md={12} sm={12} xs={12}>
                                <TextFieldForm
                                  fieldName='name'
                                  placeHolder={t('placeholders.name')}
                                />
                              </Grid>

                              <Grid item md={12} sm={12} xs={12}>
                                <EtiLocationPicker
                                  values={values}
                                  errors={errors}
                                  setFieldValue={setFieldValue}
                                  touched={touched}
                                  location={event}
                                  colorFont={'greyScale.800'}
                                  isDisabled={false}
                                />
                              </Grid>


                              <Grid item md={12} sm={12} xs={12}>
                                <Typography typography={{xs:'label.mobile', md: 'label.desktop'}} sx={{ color: 'greyScale.800' }}>{t('label.dateStart')}</Typography>
                                <Grid container spacing={3} alignItems={'flex-start'}>
                                  <Grid item xs={6} sm={6} md={4} lg={2.5}>
                                    <ETIDatePicker
                                      textFieldProps={{ fullWidth: true }}
                                      fieldName="dateStart"
                                      setFieldValue={setFieldValue}
                                    />
                                  </Grid>
                                  <Typography typography='label.desktop' sx={{ display: {xs: 'none', md: 'flex'}, color: 'greyScale.800', mt: 6, ml: 3}}> {t('label.time')}</Typography>
                                  <Grid item xs={6} sm={6} md={3}
                                  >
                                    <ETITimePicker
                                      value={values['timeStart']}
                                      onChange={(value: any) => setFieldValue('timeStart', value)}
                                      error={touched['timeStart'] && !!errors['timeStart']}
                                      helperText={touched['timeStart'] && errors['timeStart']}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>

                              <Grid item md={12} sm={12} xs={12}>
                                <Typography typography={{xs:'label.mobile', md: 'label.desktop'}} sx={{ color: 'greyScale.800'}}>{t('label.dateEnd')}</Typography>
                                <Grid container spacing={3}>
                                 <Grid item xs={6} sm={6} md={4} lg={2.5}>
                                    <ETIDatePicker
                                      textFieldProps={{ fullWidth: true }}
                                      fieldName="dateEnd"
                                      setFieldValue={setFieldValue}
                                    />
                                  </Grid>
                                  <Typography typography='label.desktop' sx={{ display: {xs: 'none', md: 'flex'}, color: 'greyScale.800', mt: 6, ml: 3 }}>{t('label.time')}</Typography>
                                  <Grid item xs={6} sm={6} md={3} 
                                  >
                                    <ETITimePicker
                                      value={values['timeEnd']}
                                      onChange={(value: any) => setFieldValue('timeEnd', value)}
                                      error={touched['timeEnd'] && !!errors['timeEnd']}
                                      helperText={touched['timeEnd'] && errors['timeEnd']}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>

                              <Grid item lg={4.8} md={12} sm={12} xs={12}>
                                <Typography typography={{xs:'label.mobile', md: 'label.desktop'}} sx={{ color: 'greyScale.800'}}>{t('label.dateSignupOpen')}</Typography>
                                <Grid container spacing={3} alignItems={'flex-start'}>
                                  <Grid item xs={6} sm={6} md={4} lg={6}>
                                    <ETIDatePicker
                                      textFieldProps={{ fullWidth: true }}
                                      fieldName="dateSignupOpen"
                                      setFieldValue={setFieldValue}
                                    
                                    />
                                  </Grid> 
                                  <Typography typography='label.desktop' sx={{ display: {xs: 'none', md: 'flex'},  color: 'greyScale.800',mt: 6, ml: 3 }}>{t('label.time')}</Typography>
                                    <Grid item xs={6} sm={6} md={3} lg={2} 
                                    >
                                      <ETITimePicker
                                        value={values['timeSignupOpen']}
                                        onChange={(value: any) => setFieldValue('timeSignupOpen', value)}
                                        error={touched['timeSignupOpen'] && !!errors['timeSignupOpen']}
                                        helperText={touched['timeSignupOpen'] && errors['timeSignupOpen']}
                                      />
                                    </Grid>
                                  </Grid> 
                                
                              </Grid>
                                

                                <Grid sx={{ mt: {xs: 0, lg: 3} }} item lg={6.8} md={12} sm={12} xs={12}>
                                  <Typography  typography={{xs:'label.mobile', md: 'label.desktop'}} sx={{display: {xs: 'flex', md: 'flex', lg: 'none'},color: 'greyScale.800'}}>{t('label.dateSignupEnd')}</Typography>
                                  <Grid container spacing={{xs: 3, md: 1}}>
                                  <Typography typography='label.desktop' sx={{ display: {xs: 'none', lg: 'flex'}, color: 'greyScale.800', mt: 4, ml: 1, mr: 1}}>{t('label.dateSignupEnd')}</Typography>
                                  <Grid item xs={6} sm={6} md={3.8} lg={6}>
                                    <ETIDatePicker
                                      textFieldProps={{ fullWidth: true }}
                                      fieldName="dateSignupEnd"
                                      setFieldValue={setFieldValue}
                                      
                                    />
                                  </Grid>
                                  <Typography typography='label.desktop' sx={{ display: {xs: 'none', lg: 'flex'}, color: 'greyScale.800', mt: 4, ml: 1}}>{t('label.timeSignupEnd')}</Typography>
                                  <Typography typography= 'label.desktop' sx={{ display: {xs: 'none', md: 'flex', lg: 'none'},  color: 'greyScale.800',mt: 4, ml: 3, mr: 2 }}>{t('label.time')}</Typography>
                                  <Grid item xs={6} sm={6} md={3} lg={2}
                                  >
                                    <ETITimePicker
                                      value={values['timeSignupEnd']}
                                      onChange={(value: any) => setFieldValue('timeSignupEnd', value)}
                                      error={touched['timeSignupEnd'] && !!errors['timeSignupEnd']}
                                      helperText={touched['timeSignupEnd'] && errors['timeSignupEnd']}
                                    />
                                  </Grid>
                                  </Grid>
                              </Grid>
                              

                              <Grid item xs={12} sx= {{mt: {xs: 1, sm: 2} }}>
                                <Grid container gap={2}>
                                  <Typography typography={{ xs:'label.mobile', md: 'label.desktop' }} sx={{display: {xs: 'none', md: 'flex'}, color: 'greyScale.800'}}>{t('label.organizers')}</Typography>
                                  <Grid item xs={12} sx={{ border: admins.length ? '1.5px solid #E68650' : '1.5px solid #FDE4AA', ...styles.organizersContainer }} >
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', height: {xs: '75px', md: '48px'}  }}>
                                      {admins.length ? (<>
                                        {admins.map((admin: any, index) => (
                                          <Chip key={index} label={admin.name} onDelete={() => handleDelete(admin.email)} variant="outlined" sx={{ ...styles.chipStyles }} />
                                        ))}
                                      </>) : <Typography typography={{xs:'label.mobile', md: 'body.regular.l'}} sx={{ display: 'flex', alignItems: {xs: 'none', md: 'center'}, ml: 1, color: {xs: 'greyScale.800', md: 'greyScale.500'} }}> {t('placeholders.organizers')} </Typography>}
                                  
                                    </Box>
                                    <Grid sx={{display: {xs: 'none', md: 'flex',}}}>
                                        <AddButton onClick={handleOpen}></AddButton>
                                    </Grid>
                                  </Grid>
                                <Grid item xs={12} sx={{ display: {xs:'flex', md: 'none'}, justifyContent: 'flex-end' }}>
                                    <AddButton onClick={handleOpen}></AddButton>
                                </Grid>
                                
                                <Modal open={open} onClose={() => handleClose([])}>
                                  <Box sx={{ ...styles.modalStyle }}>
                                    <RolesNewEvent handleClose={handleClose} selectedRows={admins} />
                                  </Box>
                                </Modal>
                              </Grid>

                              <Box sx={{ display: {xs: 'flex', md: 'none'}, border:'1px solid #E0E0E0', width: '100%', mt: '18px'}}></Box>

                            </Grid>
                            </Grid>
                          </Box>
                          <EtiButton isSubmitting={isSubmitting} isLoading={isLoading} title={t('createButton')} styleKey="mediumPrimaryButton" />
                        </Form>
                      )}
                    </Formik>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </>
      )}
    </Translation>
  );
}