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
import ETITimePicker2 from './ETITimePicker2';
import { values } from 'lodash';

// eslint-disable-next-line no-unused-vars
export default function ETICombos({ setFieldValue, selectedEvent, values }: { setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void, selectedEvent: EtiEvent | null }) {
    const idEvent = selectedEvent?.id;
    const [open, setOpen] = React.useState(false);
    const [firstPayTime, setFirstPayTime] = useState('');
    const [secondTimePay, setSecondTimePay] = useState('');
    const [timeRefundDeadline, setTimeRefundDeadline] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };

    const useStyles = makeStyles({
        root: {
            '& .MuiFormHelperText-root': {
                width: '165px',
                margin: '2px 0px 2px 2px',
            },
            '& .MuiOutlinedInput-root': {
                fontFamily: 'inter',
                width: '109px',
                display: 'flex',
                '& fieldset': {
                    borderColor: '#FDE4AA',
                    borderRadius: '8px',
                    borderWidth: '1.5px',
                    pointerEvents: 'none'
                },
                '&:hover fieldset ': {
                    borderColor: '#FDE4AA',
                    borderRadius: '8px',
                    pointerEvents: 'none'
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#FDE4AA',
                    borderRadius: '8px',
                    pointerEvents: 'none'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FDE4AA',
                },
                '& .MuiIconButton-root': {
                    color: '#A82548',
                },
            },
        },
    });

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
            await createOrUpdateDoc('events', { imageUrl: uploadedImageUrl }, idEvent === 'new' ? undefined : idEvent);
            setImageEvent(uploadedImageUrl);
        } catch (error) {
            console.error(error);
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
                                                setFieldValue('firstPay', `$ ${value}`)
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
                                            fieldName="firstDatePay"
                                            setFieldValue={setFieldValue}
                                            borderColor={false}
                                            specialCase={false}
                                        />
                                    </Grid>
                                    <Typography
                                        sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}
                                    >
                                        a las
                                    </Typography>
                                    <Grid item>
                                    <ETITimePicker2
                                        value={values.firstPayTime}
                                        onChange={(newValue) => setFieldValue('firstPayTime', newValue)}
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
                                                setFieldValue('secondPay', `$ ${value}`)
                                            }}
                                        />
                                    </Grid>
                                    <Typography
                                        sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}
                                    >
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
                                    <Typography
                                        sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}
                                    >
                                        a las
                                    </Typography>
                                    <Grid item>
                                        
                                        <ETITimePicker2 
                                            value={values.secondTimePay}
                                            onChange={(value) => setFieldValue('secondTimePay', value)}                                  
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
                                    <Typography
                                        sx={{ color: '#424242', mt: 2, ml: 2, mr: 2, fontWeight: 500 }}
                                    >
                                        hasta las
                                    </Typography>
                                    <Grid item>
                                        
                                        <ETITimePicker2 
                                            value={values.timeRefundDeadline}
                                            onChange={(value) => setFieldValue('timeRefundDeadline', value)}
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
                                                setFieldValue('limitParticipants', `${value}`)
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
                        <Grid container alignItems="center">
                            {/** Add Cloudinary  */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    maxHeight: '300px',
                                    marginTop: '20px',
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
                                        onImageUpload={(uploadedImageUrl: string) => handleChangeImage(uploadedImageUrl)}
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
    )
}