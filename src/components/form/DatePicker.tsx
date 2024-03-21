import React from 'react';
import { DatePicker } from 'formik-mui-x-date-pickers';
import { Field, useField } from 'formik';

export const ETIDatePicker = ({
  fieldName,
  setFieldValue,
  textFieldProps
}: {
  fieldName: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  textFieldProps: any;

}) => {
  const [field] = useField(fieldName);
  const inputStyle = {
    '& .MuiFormHelperText-root': {
      width: '165px',
    },
    '& .MuiOutlinedInput-root': {
      fontFamily: 'roboto',
      width: '165px',
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
        borderColor: field.value ? 'details.perseanOrange' : 'details.peach',
      },
      '& .MuiIconButton-root': {
        color: 'principal.secondary'
      } 
  }
}
  return (
      <Field
        component={DatePicker}
        disablePast
        textField={{
          ...textFieldProps,
          sx: inputStyle,
          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
            e.preventDefault();
          },
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

  );
};