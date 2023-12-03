/* eslint-disable prettier/prettier */
import React from 'react';
import { DatePicker } from 'formik-mui-x-date-pickers';
import { Field } from 'formik';

export const ETIDatePicker = ({
  label,
  fieldName,
  setFieldValue,
  textFieldProps
}: {
  label: string;
  fieldName: string;
  // eslint-disable-next-line no-unused-vars
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  textFieldProps: any;
}) => (
  <Field
    component={DatePicker}
    disablePast
    textField={textFieldProps}
    label={label}
    name={fieldName}
    inputFormat="DD-MM-YYYY"
    mask="__-__-____"
    onChange={(value: any) => setFieldValue(fieldName, value.toDate())}
  />
);
