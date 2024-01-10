/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Button, Grid, Box, Typography, Chip, Icon, Modal } from '@mui/material';
import { Field } from 'formik';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import InputAdornment from '@mui/material/InputAdornment';
import CloudinaryUploadWidget from 'components/CloudinaryUploadWidget';
import { EtiEvent } from 'shared/etiEvent';
import { ETIDatePicker } from './form/DatePicker';
import { ETITimePicker } from './form/TimePicker';
import { createOrUpdateDoc } from 'helpers/firestore';

// eslint-disable-next-line no-unused-vars
export default function ETICombos({ setFieldValue, selectedEvent }: { setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void, selectedEvent: EtiEvent | null }) {
  const idEvent = selectedEvent?.id;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const [enable, setEnable] = useState(false);
  const handleClose = () => {
    setOpen(false);
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
      height: '500px'
    };


  const classes = useStyles();

  // Add Cloudinary
  const [imageEvent, setImageEvent] = useState('');

  const cloudNameCredencial = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const cloudPresetCredencial = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  const cloudName = cloudNameCredencial;
  const uploadPreset = cloudPresetCredencial;

  const uwConfig = {
    cloudName,
    uploadPreset
  };

  const handleChangeImage = async (uploadedImageUrl: string) => {
    try {
      await createOrUpdateDoc(
        'events',
        { imageUrl: uploadedImageUrl },
        idEvent === 'new' ? undefined : idEvent
      );
      setImageEvent(uploadedImageUrl);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <Box
        sx={{
          display: 'flex'
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            {/**Section Combos */}
            <Grid container gap={2}>
              <Typography sx={{ color: '#424242', fontWeight: 500, fontSize: '20px' }}>
                Combos
              </Typography>
              <Grid item md={12} sm={12} xs={12}>
                <Grid
                  container
                  gap={2}
                  sx={{
                    border: '1.5px solid #E68650',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Chip
                      label="milonga"
                      variant="outlined"
                      sx={{
                        m: 1,
                        borderRadius: '8px',
                        color: '#A82548',
                        fontFamily: 'Roboto',
                        fontWeight: 500,
                        fontSize: '14px'
                      }}
                    />
                  </Box>
                  <Button
                    sx={{ padding: '12px, 16px, 12px, 16px', alignItems: 'flex-end' }}
                    onClick={handleOpen}
                  >
                    <Icon sx={{ display: 'flex', width: '4em' }}>
                      <Typography
                        sx={{ mr: 1, color: '#A82548', fontFamily: 'Roboto', fontWeight: 500 }}
                      >
                        Añadir
                      </Typography>
                      <img src="/img/icon/bag-tick-2.svg" height={25} width={25} />
                    </Icon>
                  </Button>
                </Grid>
                {/** Added component Modal  */}
                <Modal open={open} onClose={() => handleClose()}>
                  <Box sx={{ ...styleModal, display: 'flex', flexDirection: 'column' }}>
                    <Grid container alignItems="center">
                      <Grid>
                        {/* Title */}
                        <Typography variant="h4">Añadí más productos al combo</Typography>
                      </Grid>
                      <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {/* Icon add */}
                        <Button
                          variant="contained"
                          style={{
                            background: '#FF6F87',
                            boxShadow: 'none',
                            borderRadius: '100%',
                            margin: 5
                          }}
                        >
                          {/* Validate*/}
                          <img
                            src={'/img/icon/btnDelete.png'}
                            alt="btnDelete"
                            style={{
                              width: '100%',
                              height: 'auto'
                            }}
                          />
                        </Button>
                      </Grid>
                      <Grid>
                        {/* Icon remove */}
                        <Button
                          variant="contained"
                          style={{
                            background: '#00639F',
                            boxShadow: 'none',
                            borderRadius: '100%',
                            margin: 5
                          }}
                        >
                          {/* Validate*/}
                          <img
                            src={'/img/icon/btnPlus.png'}
                            alt="btnPlus"
                            style={{
                              width: '100%',
                              height: 'auto'
                            }}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                    {/** Fields  */}
                    <Grid item xs={12}>
                      <Field
                        name="name"
                        placeholder="Producto 1"
                        component={TextField}
                        required
                        fullWidth
                        sx={{ marginTop: 3 }} // Adjust the marginTop value as necessary
                        classes={{ root: classes.root }}
                      />
                      <Grid item xs={12}>
                        <Field
                          name="name"
                          placeholder="Producto 2"
                          component={TextField}
                          required
                          fullWidth
                          sx={{ marginTop: 3 }} // Adjust the marginTop value as necessary
                          classes={{ root: classes.root }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          name="name"
                          placeholder="Producto 3"
                          component={TextField}
                          required
                          fullWidth
                          sx={{ marginTop: 3 }} // Adjust the marginTop value as necessary
                          classes={{ root: classes.root }}
                        />
                      </Grid>
                      <Grid container justifyContent="flex-end">
                        <Grid item>
                          {/** Button to add  */}
                          <Button
                            variant="contained"
                            color="secondary"
                            type="submit"
                            disabled={enable}
                            sx={{
                              width: '150px',
                              padding: '12px, 32px, 12px, 32px',
                              borderRadius: '25px',
                              marginTop: '80px',
                              backgroundColor: enable ? '#CCCCCC' : '#A82548',
                              height: '44px',
                              '&:hover': {
                                backgroundColor: enable ? '#CCCCCC' : '#A82548'
                              }
                            }}
                          >
                            <Typography
                              sx={{
                                color: '#FAFAFA',
                                fontWeight: 500,
                                fontSize: '15px',
                                lineHeight: '10px'
                              }}
                            >
                              Agregar
                            </Typography>
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
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
                      name="firstPay"
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
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const value: string = event.target.value;
                        setFieldValue('firstPay', `$ ${value}`);
                      }}
                    />
                  </Grid>
                  <Typography sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}>
                    abonando hasta el
                  </Typography>
                  <Grid item>
                    {/**Add icons */}
                    <ETIDatePicker
                      textFieldProps={{ fullWidth: true }}
                      fieldName="firstDatePay"
                      setFieldValue={setFieldValue}
                      borderColor={false}
                      specialCase={false}
                    />
                  </Grid>
                  <Typography sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}>
                    a las
                  </Typography>
                  <Grid item>
                    <ETITimePicker
                      textFieldProps={{ fullWidth: true }}
                      fieldName="FirstTimePay"
                      setFieldValue={setFieldValue}
                      borderColor={false}
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
                      name="secondPay"
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
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const value: string = event.target.value;
                        setFieldValue('secondPay', `$ ${value}`);
                      }}
                    />
                  </Grid>
                  <Typography sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}>
                    abonando desde el
                  </Typography>
                  <Grid item>
                    <ETIDatePicker
                      textFieldProps={{ fullWidth: true }}
                      fieldName="secondDatePay"
                      setFieldValue={setFieldValue}
                      borderColor={false}
                      specialCase={false}
                    />
                  </Grid>
                  <Typography sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}>
                    a las
                  </Typography>
                  <Grid item>
                    <ETITimePicker
                      textFieldProps={{ fullWidth: true }}
                      fieldName="secondTimePay"
                      setFieldValue={setFieldValue}
                      borderColor={false}
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
                      fieldName="refundDeadline"
                      setFieldValue={setFieldValue}
                      borderColor={false}
                      specialCase={false}
                    />
                  </Grid>
                  <Typography sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}>
                    hasta las
                  </Typography>
                  <Grid item>
                    <ETITimePicker
                      textFieldProps={{ fullWidth: true }}
                      fieldName="timeRefundDeadline"
                      setFieldValue={setFieldValue}
                      borderColor={false}
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
                      name="limitParticipants"
                      placeholder="1000"
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
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const value: string = event.target.value;
                        setFieldValue('limitParticipants', `${value}`);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/**Front Page, buttons and Cloudinary*/}
              <Grid>
                <Typography sx={{ color: '#212121', fontWeight: 500, fontSize: '20px' }}>
                  Portada
                </Typography>
              </Grid>
            </Grid>
            <Grid container alignItems="center">
              {/** Add Cloudinary  */}
              <Box
                sx={{
                  display: 'flex',
                  maxHeight: '300px',
                  marginTop: '20px'
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

                <Box sx={{ display: 'flex', alignItems: 'center', ml: 5 }}>
                  <CloudinaryUploadWidget
                    uwConfig={uwConfig}
                    onImageUpload={(uploadedImageUrl: string) =>
                      handleChangeImage(uploadedImageUrl)
                    }
                  />

                  <Button
                    sx={{
                      width: '115px',
                      padding: '12px, 32px, 12px, 32px',
                      borderRadius: '12px',
                      ml: 3,
                      border: '1px solid #9E9E9E',
                      backgroundColor: 'transparent',
                      height: '44px',
                      '&:hover': { backgroundColor: 'transparent' }
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
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
