/* eslint-disable prettier/prettier */
import React from 'react';
import { DatePicker } from 'formik-mui-x-date-pickers';
import { makeStyles } from '@mui/styles';
import { Field } from 'formik';

const CustomSVGIcon = () => (
  <img src="/img/icon/calendar-add.svg" alt="Custom Icon" width="24" height="24" /> // Usar la ruta a tu SVG externo
);

// const useStyles = makeStyles({
//   root: {
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: '#E68650',
//         borderRadius: '8px',
//         borderWidth: '2px'   
//       },
//       '&:hover fieldset ': {
//         borderColor: '#E68650',
//         borderRadius: '8px',
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#E68650',
//         borderRadius: '8px',
//       },
//       '& .MuiIconButton-root': { // Estilos para el icono del DatePicker
//         color: '#A82548', // Cambiar el color del icono aquí
        
//       //}
//       }
//     }

//   },
// });


export const ETIDatePicker = ({
  
  fieldName,
  setFieldValue,
  textFieldProps,
  specialCase,
  borderColor,
  
}: {
  fieldName: string;
  // eslint-disable-next-line no-unused-vars
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  textFieldProps: any;
  specialCase: boolean;
  borderColor: boolean;
}) => {
  
  const useStyles = makeStyles({
    root: { 
       '& .MuiFormHelperText-root': {
        width: '165px',
        margin: '2px 0px 0px 2px',
         },   
      '& .MuiOutlinedInput-root': {
        fontFamily: 'inter',
        width: '165px',
        display: 'flex',
        flexDirection: 'row-reverse',
        padding: '2px',
        '& fieldset': {
          borderColor: specialCase ? '#E68650' : (borderColor ? '#E68650' : '#FDE4AA'),
          borderRadius: '8px',
          borderWidth: '1.5px',
          pointerEvents: 'none'
        },
        '&:hover fieldset ': {
          borderColor: specialCase ? '#E68650' : (borderColor ? '#E68650' : '#FDE4AA'),
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '&.Mui-focused fieldset': {
          borderColor: specialCase ? '#E68650' : (borderColor ? '#E68650' : '#FDE4AA'),
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: specialCase ? '#E68650' : (borderColor ? '#E68650' : '#FDE4AA'),
        },
        '& .MuiIconButton-root': { 
          color: '#A82548', 
        },   
      },
    },
  });

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
