/* eslint-disable prettier/prettier */
import React from 'react';
import { DatePicker } from 'formik-mui-x-date-pickers';
import { makeStyles } from '@mui/styles';
import { Field, useField } from 'formik';

interface Localization {
  title: {
    [key: string]: string;
  };
}

const l10n: Localization = {
  title: { en: 'title', es: 'título' }
};

export const ETIDatePicker = ({
  fieldName,
  setFieldValue,
  textFieldProps,
  specialCase,
  borderColor,
}: {
  fieldName: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  textFieldProps: any;
  specialCase: boolean;
  borderColor: boolean;
}) => {
  const [field] = useField(fieldName);
  const useStyles = makeStyles({
    root: {
      '& .MuiFormHelperText-root': {
        width: '165px',
        margin: '2px 0px 0px 2px'
      },
      '& .MuiOutlinedInput-root': {
        fontFamily: 'inter',
        width: '165px',
        display: 'flex',
        flexDirection: 'row-reverse',
        padding: '2px',
        '& fieldset': {
          borderColor: field.value ? '#E68650' : '#FDE4AA',
          borderRadius: '8px',
          borderWidth: '1.5px',
          pointerEvents: 'none'
        },
        '&:hover fieldset ': {
          borderColor: field.value ? '#E68650' : '#FDE4AA',
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '&.Mui-focused fieldset': {
          borderColor: field.value ? '#E68650' : '#FDE4AA',
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: field.value ? '#E68650' : '#FDE4AA'
        },
        '& .MuiIconButton-root': {
          color: '#A82548'
        }
      }
    }
  });

  const classes = useStyles();
  
  return (
    <div>
      <Field
        component={DatePicker}
        disablePast
        textField={{
          ...textFieldProps,
          className: classes.root,
          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
            e.preventDefault();
          }
        }}
        inputProps={{
          style: {
            fontFamily: 'inter'
          }
        }}
        name={fieldName}
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
