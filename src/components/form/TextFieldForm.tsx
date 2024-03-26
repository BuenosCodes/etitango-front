import { Field, useField } from 'formik';
import { TextField } from 'formik-mui';

export const TextFieldForm = ({
  fieldName,
  placeHolder
}: {
  fieldName: string;
  placeHolder: string;

}) => {
  const [field] = useField(fieldName)
return (
    <Field
    disablePast
    component={TextField}
    required
    fullWidth
    placeholder={placeHolder}
    name={fieldName}
    sx={{
      '& .MuiOutlinedInput-root': {
        fontFamily: 'roboto',
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
        }
      },
    }}
  />
  
)
};