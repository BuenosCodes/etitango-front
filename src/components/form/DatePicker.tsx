import React from 'react';
import { DatePicker } from 'formik-mui-x-date-pickers';
import { Field, useField } from 'formik';
import { Grid } from '@mui/material';

export const ETIDatePicker = ({
  fieldName,
  setFieldValue,
  textFieldProps
}: {
  fieldName: string;
  // eslint-disable-next-line no-unused-vars
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  textFieldProps: any;
}) => {
  const [field] = useField(fieldName);
  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      fontFamily: 'roboto',
      display: 'flex',
      flexDirection: 'row-reverse',
      padding: '2px',
      '& fieldset': {
        borderColor: field.value ? 'details.perseanOrange' : 'details.peach',
        borderRadius: '8px',
        borderWidth: '1.5px',
        pointerEvents: 'none'
      },
      '&:hover fieldset ': {
        borderColor: field.value ? 'details.perseanOrange' : 'details.peach',
        borderRadius: '8px',
        pointerEvents: 'none'
      },
      '&.Mui-focused fieldset': {
        borderColor: field.value ? 'details.perseanOrange' : 'details.peach',
        borderRadius: '8px',
        pointerEvents: 'none'
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: field.value ? 'details.perseanOrange' : 'details.peach'
      },
      '& .MuiIconButton-root': {
        color: 'principal.secondary'
      }
    }
  };

const containerStyle = {
  width: '100%', 
};
  return (
  
    <div style={containerStyle}>
      
      <Field
        component={DatePicker}
        disablePast
        textField={{
          ...textFieldProps,
          sx: inputStyle,
          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
            e.preventDefault();
          }
        }}
        name={fieldName}
        inputFormat="DD-MM-YYYY"
        mask="__-__-____"
        onChange={(value: any) => {
          if (value && value.toDate) {
            setFieldValue(fieldName, value.toDate());
          } else {
            setFieldValue(fieldName, null);
          }
        }}
      />
     
      </div>
     
  );
};
