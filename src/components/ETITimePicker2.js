/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import TextField from '@mui/material/TextField';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/system';

interface ETITimePicker2Props {
  value: string | undefined;
  onChange: (value: string) => void;
  isDisabled: boolean;
  showBorders?: boolean;
  error: any;
  helperText: any;   
}

const ETITimePicker2: React.FC<ETITimePicker2Props> = ({ value, onChange, isDisabled, showBorders = true, error, helperText}) => {

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      label=""
      type="text"
      value={value}
      onChange={handleInputChange}
      onBlur={handleInputChange}
      disabled={isDisabled}
      error={error}
      helperText={helperText}    
      style={{ width: '102px', height: '48px', borderRadius: '12px'}}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccessTimeIcon sx={{ color: '#A82548', fontSize: 'large' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiFormHelperText-root': {
          margin: '2px 0px 0px 2px',
          width: '110px',
        },
        '& input[type="text"]::-webkit-inner-spin-button, & input[type="text"]::-webkit-outer-spin-button': {
          '-webkit-appearance': 'none',
          margin: 0,
        },
        '& input[type="text"]': {
          '-moz-appearance': 'textfield',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderRadius: '8px',
            borderColor: showBorders ? (value ? '#E68650' : '#FDE4AA') : 'transparent',
            borderWidth: showBorders ? 1 : 0,
          },
          '&:hover fieldset': {
            borderRadius: '8px',
            borderColor: showBorders ? '#E68650' : 'transparent',
          },
          '&.Mui-focused fieldset': {
            borderRadius: '8px',
            borderColor: showBorders ? '#E68650' : 'transparent',
          },
        },
      }}
    />
  );
};

export default ETITimePicker2;