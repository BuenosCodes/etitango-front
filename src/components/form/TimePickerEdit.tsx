import { TimePicker } from 'formik-mui-x-date-pickers';
import { makeStyles } from '@mui/styles';
import { Field } from 'formik';
import { InputAdornment } from '@mui/material';
import { useState } from 'react';

const useStyles = makeStyles({
    root: {
      '& .MuiFormHelperText-root': {
        width: '110px',
        margin: '2px 0px 0px 2px'
         },   
      '& .MuiOutlinedInput-root': {
        fontFamily: 'inter',
        width: '110px',
        '& fieldset': {
          borderColor: '#E68650',
          borderRadius: '8px',
          borderWidth: '2px',
          pointerEvents: 'none'
        },
        '&:hover fieldset ': {
          borderColor:'#E68650', 
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '&.Mui-focused fieldset': {
          borderColor: '#E68650', 
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#E68650'
        },
        '& .MuiIconButton-root': {
            color: '#A82548', 
          },
          '& .MuiFormHelperText-root': {
            width: '110px'
          }       
      },
    },
  });

export const ETITimePickerEdit = ({
  fieldName,
  setFieldValue,
  textFieldProps,
  
  
}: {
  fieldName: string;
  // eslint-disable-next-line no-unused-vars
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  textFieldProps: any;
  

}) => {
  
  const CustomSVGIcon = () => (
    <img src="/img/icon/clock.svg" alt="Clock Icon" height={25} width={25} /> // Usar la ruta a tu SVG externo
  );

  const classes = useStyles();
  const [hora, setHora] = useState()

return (
  <Field
      component={TimePicker}
      disablePast
      textField={{
        ...textFieldProps,
        className: classes.root, // Agregar las clases al DatePicker
        InputProps: {
          startAdornment: (
            <InputAdornment  position="start">
             <img src="/img/icon/clock.svg"  />
            </InputAdornment>
          ),
        },
      }}
      inputProps={{
        style: {
          fontFamily: 'inter',
        },
      }}
      label={hora}
      name={fieldName}
      inputFormat="00:00"
      onChange={(value:any) => {
        if (value && value.format) {
            const horaComoString = value.format('HH:mm A');
            console.log('hora como string ->', horaComoString);
            setHora(horaComoString.slice(0,-3))
            setFieldValue(fieldName, horaComoString);
          }
      }}
  />
)};