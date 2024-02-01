/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';

import { Button, Grid, Box, Typography, Chip, Icon, Modal } from '@mui/material';
import { Field } from 'formik';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import InputAdornment from '@mui/material/InputAdornment';
import CloudinaryUploadWidget from 'components/CloudinaryUploadWidget';
import { EtiEvent } from 'shared/etiEvent';
import { ETIDatePicker } from './form/DatePicker';
import { createOrUpdateDoc, deleteImageUrlFromEvent } from 'helpers/firestore';
import ETITimePicker2 from './ETITimePicker2';
import { getEvent, getEvents } from 'helpers/firestore/events';

interface ETICombosProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  selectedEvent: EtiEvent | null;
  setComboValues: Function
  values: {
    firstPay?: string;
    secondPay?: string;
    limitParticipants?: string;
    firstTimePay?: string;
    secondTimePay?: string;
    timeRefundDeadline?: string;
  };
  errors: any;
  touched: any;
  EventImage: any;
}

const ETICombos: React.FC<ETICombosProps> = ({ setFieldValue, selectedEvent, values, errors, touched, setComboValues, EventImage }) => {

  const idEvent = selectedEvent?.id;
  const combos = selectedEvent?.combos
  const eventImage = selectedEvent?.imageUrl;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  }

  const [enable, setEnable] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [IsLoading, setIsLoading] = useState(true);
  const [fieldCount, setFieldCount] = useState(0);
  const [productValues, setProductValues] = useState<string[]>([]);
  const [fieldValues, setFieldValues] = useState(Array.from({ length: 1 }, (_, index) => `Producto ${index + 1}`));

  useEffect(() => {
    if (combos) {
      setProductValues(combos);
      setComboValues(combos)
    }
  }, [combos]);


  const handleAddField = () => {
    setFieldCount(fieldCount + 1);
    setFieldValues([...fieldValues, `Producto ${fieldCount + 1}`])
  };


  const handleRemoveField = () => {
    if (fieldCount > 0) {
      setFieldCount((prevFieldCount) => prevFieldCount - 1);
      setFieldValues((prevProductValues) => {
        const updatedValues = [...prevProductValues];
        updatedValues.pop();
        return updatedValues;
      });
    }
  };


  const handleAddProducts = () => {
    const nuevosProductos = fieldValues.filter((value) => value.trim() !== "");
    const productosCombinados = [...productValues, ...nuevosProductos];
    const productosUnicos = Array.from(new Set(productosCombinados));
    setProductValues(productosUnicos);
    setComboValues(productosUnicos)
    handleClose();
  };


  const handleProductChange = (index: number, newValue: string) => {
    setFieldValues((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[index] = newValue;
      return updatedValues;
    });
  };

  const handleDelete = (productToDelete: string) => {
    try {
      const staticProduct = ["Dos milongas", "Asamblea Etiana", "Comida de despedida"].includes(productToDelete);
      if (!staticProduct) {
        setProductValues((prevProducts) => prevProducts.filter((product) => product !== productToDelete)); // Se elimina el combo de los Chips
        setComboValues((prevProducts) => prevProducts.filter((product) => product !== productToDelete)); // Se elimina el combo del field del Modal
      }
    } catch (error) {
      console.error('Error al borrar combos', error);
    }
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
        margin: '2px 0px 0px 2px',
        width: '120px',
      },
      '& .MuiOutlinedInput-root': {
        width: '120px',
        paddingLeft: '10px',
        fontFamily: 'inter',
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
          borderColor: '#FDE4AA'
        }
      }
    },
    filled: {
      '& .MuiOutlinedInput-root': {
        width: '120px',
        paddingLeft: '10px',
        fontFamily: 'inter',
        '& fieldset': {
          borderColor: '#E68650',
          borderRadius: '8px',
        },
        '&:hover fieldset ': {
          borderColor: '#E68650',
          borderRadius: '8px',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#E68650',
          borderRadius: '8px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#E68650',
        }
      },
    },
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
  const [imageUrlEvent, setImageUrlEvent] = useState('');

  const cloudNameCredencial = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const cloudPresetCredencial = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  const cloudName = cloudNameCredencial;
  const uploadPreset = cloudPresetCredencial;

  const uwConfig = {
    cloudName,
    uploadPreset
  };

  // const handleChangeImage = async (uploadedImageUrl: string) => {
  //   try {
  //     await createOrUpdateDoc(
  //       'events',
  //       { imageUrl: uploadedImageUrl },
  //       idEvent === 'new' ? undefined : idEvent
  //     );
  //     setImageUrlEvent(uploadedImageUrl);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleUpdateImage = (uploadImageUrl: string) => {
    setImageUrlEvent(uploadImageUrl);
    EventImage(uploadImageUrl)
  }

  useEffect(() => {
    if (selectedEvent?.imageUrl) {
      setImageUrlEvent(selectedEvent.imageUrl);
    }
  }, [selectedEvent?.imageUrl]);


  return (
    <>
      <hr style={{ border: '1px solid #E0E0E0', marginLeft: '-16px', marginRight: '-16px', marginTop: '20px' }} />
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
                    justifyContent: 'space-between',

                  }}
                >

                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {productValues.length === 0 ? (
                      <Typography variant="body2" color="text.disabled" sx={{ fontWeight: 500, p: 2 }}>
                        En este evento no se han añadido combos.
                      </Typography>
                    ) : (
                      productValues.map((product: any, index) => (
                        <Chip
                          key={index}
                          label={product}
                          onDelete={index >= 3 ? () => handleDelete(product) : undefined}
                          variant="outlined"
                          sx={{ m: 1, borderRadius: '8px', color: index < 3 ? '#5FB4FC' : '#0075D9', fontFamily: 'Roboto', fontWeight: 500, fontSize: '14px' }}
                        />
                      ))
                    )}
                  </Box>

                  <Button
                    sx={{ padding: '12px, 16px, 12px, 16px', alignItems: 'flex-end', flexDirection: 'column' }}
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
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid>
                        {/* Title */}
                        <Typography variant="h4">Añadí más productos al combo</Typography>
                      </Grid>
                      <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {/* Icon add */}
                        <Button onClick={() => handleRemoveField()}>
                          {/* Validate*/}
                          <img
                            src={'/img/icon/btnDelete.svg'}
                            alt="btnDelete"
                            height={50}
                            width={50}
                          />
                        </Button>
                        {/* Icon remove */}
                        <Button onClick={() => handleAddField()}>
                          {/* Validate*/}
                          <img src={'/img/icon/btnPlus.svg'} alt="btnPlus" height={50} width={50} />
                        </Button>
                      </Grid>
                    </Grid>



                    {/** Fields  */}

                    <Box sx={{ ...scrollbarStyles, height: '100%' }}>
                      <Grid item xs={12}>
                        {fieldValues.map((value, index) => (
                          <Field
                            key={index}
                            name={`product${index + 1}`}
                            placeholder={`Producto ${index + 1}`}
                            component={TextField}
                            required
                            fullWidth
                            // disabled={index < 3}
                            sx={{ marginTop: 3 }}
                            classes={{ root: classes.root }}

                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProductChange(index, e.target.value)}
                          />
                        ))}
                      </Grid>
                    </Box>


                    <Grid item sx={{ height: '15%', display: 'flex', justifyContent: "flex-end" }}>
                      {/** Button to add  */}
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleAddProducts()}
                        disabled={enable}
                        sx={{
                          width: '150px',
                          padding: '12px, 32px, 12px, 32px',
                          borderRadius: '25px',
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
                      error={touched['firstPay'] && !!errors['firstPay']}
                      helperText={touched['firstPay'] && errors['firstPay']}
                      fullWidth
                      classes={{ root: values.firstPay ? classes.filled : classes.root }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <img src="/img/icon/dollar.svg" alt="dollar" />
                          </InputAdornment>
                        )
                      }}
                      value={values?.firstPay || ''}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const value: string = event.target.value;
                        setFieldValue('firstPay', value);
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
                    <ETITimePicker2
                      value={values['firstTimePay']}
                      onChange={(value) => setFieldValue('firstTimePay', value)}
                      isDisabled={false}
                      error={touched['firstTimePay'] && !!errors['firstTimePay']}
                      helperText={touched['firstTimePay'] && errors['firstTimePay']}
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
                      error={touched['secondPay'] && !!errors['secondPay']}
                      helperText={touched['secondPay'] && errors['secondPay']}
                      fullWidth
                      classes={{ root: values.secondPay ? classes.filled : classes.root }}
                      value={values?.secondPay || ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <img src="/img/icon/dollar.svg" alt="dollar" />
                          </InputAdornment>
                        )
                      }}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const value: string = event.target.value;
                        setFieldValue('secondPay', value);
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
                    <ETITimePicker2
                      value={values['secondTimePay']}
                      onChange={(value) => setFieldValue('secondTimePay', value)}
                      isDisabled={false}
                      error={touched['secondTimePay'] && !!errors['secondTimePay']}
                      helperText={touched['secondTimePay'] && errors['secondTimePay']}
                    />
                  </Grid>
                  <hr style={{ border: '1px solid #E0E0E0', marginLeft: '-16px', marginRight: '-16px', marginTop: '20px' }} />
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
                    <ETITimePicker2
                      value={values['timeRefundDeadline']}
                      onChange={(value) => setFieldValue('timeRefundDeadline', value)}
                      isDisabled={false}
                      error={touched['timeRefundDeadline'] && !!errors['timeRefundDeadline']}
                      helperText={touched['timeRefundDeadline'] && errors['timeRefundDeadline']}
                    />
                  </Grid>
                </Grid>
                <hr style={{ border: '1px solid #E0E0E0', marginLeft: '-16px', marginRight: '-16px', marginTop: '45px' }} />
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
                      error={touched['limitParticipants'] && !!errors['limitParticipants']}
                      helperText={touched['limitParticipants'] && errors['limitParticipants']}
                      fullWidth
                      classes={{ root: values.limitParticipants ? classes.filled : classes.root }}
                      value={values?.limitParticipants || ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <img src="/img/icon/people.svg" alt="people" />
                          </InputAdornment>
                        )
                      }}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const value: string = event.target.value;
                        setFieldValue('limitParticipants', value);
                      }}
                    />
                  </Grid>
                </Grid>
                <hr style={{ border: '1px solid #E0E0E0', marginLeft: '-16px', marginRight: '-16px', marginTop: '20px' }} />
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
                    maxWidth: { xs: 450, md: 360 },
                    borderRadius: '16px'
                  }}
                  alt="Imagen representativa del evento"
                  src={imageUrlEvent ? imageUrlEvent : '/img/imageNotFound.svg'}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', ml: 5 }}>
                  <CloudinaryUploadWidget
                    uwConfig={uwConfig}
                    onImageUpload={(uploadedImageUrl: string) =>
                      handleUpdateImage(uploadedImageUrl)
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

                    onClick={async () => {
                      try {
                        const success = await deleteImageUrlFromEvent(idEvent);
                        if (success) {
                          setImageUrlEvent('');
                          console.log('La imagen se elimino correctamente.');
                        }
                      } catch (error) {
                        console.error('eliminar imagen fallo ', error);
                      }
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

export default ETICombos;