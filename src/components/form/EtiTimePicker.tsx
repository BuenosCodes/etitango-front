import TextField from '@mui/material/TextField';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InputAdornment from '@mui/material/InputAdornment';
import { SCOPES } from 'helpers/constants/i18n';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { useGlobalState } from 'helpers/UserPanelContext';

interface ETITimePickerProps {
  value: string;
  onChange: Function;
  error?: boolean | undefined;
  helperText?: any;
}

export const ETITimePicker = (props: ETITimePickerProps) => {
  const { value, onChange, error, helperText } = props;
  const { t } = useTranslation(SCOPES.MODULES.ETI, { useSuspense: false });
  const { isMobile } = useGlobalState();
  const handleInputChange = (event: any) => {
    const inputValue = event.target.value;
    const sanitizedValue = inputValue.replace(/[^0-9:]/g, '');
    const isValidTime = /^([01]?[0-9]|2[0-3]?):?([0-5]?[0-9]?)?$/.test(sanitizedValue);

    if (isValidTime || sanitizedValue === '') {
      if (sanitizedValue.length === 2 && !sanitizedValue.includes(':')) {
        onChange(sanitizedValue + ':');
      } else {
        onChange(sanitizedValue);
      }
    }

    if (sanitizedValue.length >= 2) {
      const hours = parseInt(sanitizedValue.substring(0, 2));
      if (hours > 23) {
        onChange('');
      }
    }

    if (sanitizedValue.length >= 5) {
      const minutes = parseInt(sanitizedValue.substring(3));
      if (minutes > 59) {
        onChange(sanitizedValue.substring(0, 2) + ':');
      }
    }
  };

  return (
    <TextField
      type="text"
      label={
        isMobile ? (
          <Typography typography={'label.mobilePicker'} sx={{ color: 'greyScale.800' }}>
            {t('label.time')}
          </Typography>
        ) : null
      }
      placeholder={t('placeholders.hour')}
      value={value}
      onChange={handleInputChange}
      onBlur={handleInputChange}
      error={error}
      helperText={helperText}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccessTimeIcon sx={{ color: 'principal.secondary', fontSize: 'large' }} />
          </InputAdornment>
        )
      }}
      sx={{
        '& .MuiFormHelperText-root': {
          margin: '2px 0px 0px 2px'
        },
        '& input[type="text"]::-webkit-inner-spin-button, & input[type="text"]::-webkit-outer-spin-button':
          {
            '-webkit-appearance': 'none',
            margin: 0
          },
        '& .MuiOutlinedInput-root': {
          fontFamily: 'roboto',
          height: '60px',
          width: { sm: '100%', md: '104px' },
          '& fieldset': {
            borderRadius: '8px',
            borderColor: value ? 'details.perseanOrange' : 'details.peach',
            borderWidth: 1
          },
          '&:hover fieldset': {
            borderRadius: '8px',
            borderColor: 'details.peach'
          },
          '&.Mui-focused fieldset': {
            borderRadius: '8px',
            borderColor: 'details.perseanOrange'
          }
        }
      }}
    />
  );
};
