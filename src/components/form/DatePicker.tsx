/* eslint-disable prettier/prettier */
import React from 'react';
import { DatePicker } from 'formik-mui-x-date-pickers';
import { makeStyles } from '@mui/styles';
import { Field } from 'formik';

const CustomSVGIcon = () => (
  <img src="/img/icon/calendar-add.svg" alt="Custom Icon" width="24" height="24" /> // Usar la ruta a tu SVG externo
);

const useStyles = makeStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#E68650',
        borderRadius: '8px',
        borderWidth: '2px'   
      },
      '&:hover fieldset ': {
        borderColor: '#E68650',
        borderRadius: '8px',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#E68650',
        borderRadius: '8px',
      },
      '& .MuiIconButton-root': { // Estilos para el icono del DatePicker
        color: '#A82548', // Cambiar el color del icono aquí
        
      //}
      }
    }

  },
});


export const ETIDatePicker = ({
  
  fieldName,
  setFieldValue,
  textFieldProps,
  
}: {
  fieldName: string;
  // eslint-disable-next-line no-unused-vars
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  textFieldProps: any;
  
}) => {
  
  const classes = useStyles();

return (
  <Field
      component={DatePicker}
      disablePast
      textField={{
        ...textFieldProps,
        className: classes.root, // Agregar las clases al DatePicker
      }}
      inputProps={{
        style: {
          fontFamily: 'inter',
        },
      }}
      name={fieldName}
      inputFormat="DD-MM-YYYY"
      inputIcon= {<CustomSVGIcon />}
      mask="__-__-____"
      onChange={(value: any) => setFieldValue(fieldName, value.toDate())}
    />


 
)};
