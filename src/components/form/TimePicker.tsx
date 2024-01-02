/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { TimePicker } from 'formik-mui-x-date-pickers';
import { makeStyles } from '@mui/styles';
import { Field } from 'formik';

export const ETITimePicker = ({
  
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
      '& .MuiOutlinedInput-root': {
        fontFamily: 'inter',
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
          }   
      },
    },
  });

  const classes = useStyles();
  const [hora, setHora] = useState()
return (
  <Field
      component={TimePicker}
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
      label={hora}
      name={fieldName}
      inputFormat="00:00"
      onChange={(value:any) => {
        if (value && value.format) {
            const horaComoString = value.format('HH:mm A');
            console.log('hora como string ->', horaComoString);
            setHora(horaComoString)
            setFieldValue(fieldName, horaComoString);
          }
      }}
  />
)};
