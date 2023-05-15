import React from 'react';
import { DateTimePicker } from 'formik-mui-x-date-pickers';
import { Field } from 'formik';

export const ETIDatePicker = ({
  label,
  fieldName,
  views = ['day'],
  setFieldValue,
  textFieldProps
}: {
  label: string;
  fieldName: string;
  views?: string[] ;
  // eslint-disable-next-line no-unused-vars
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  textFieldProps: any;
}) => (
  <Field
    component={DateTimePicker}
    disablePast
    textField={textFieldProps}
    label={label}
    name={fieldName}
    inputFormat="DD-MM-YYYY hh:mm"
    mask="__-__-____"
    onChange={(value: any) => setFieldValue(fieldName, value.toDate())}
    views={views}
  />
);
