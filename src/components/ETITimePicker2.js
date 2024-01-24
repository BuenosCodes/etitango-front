/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import TextField from '@mui/material/TextField';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/system';

interface ETITimePicker2Props {
  value: string;
  onChange: (value: string) => void;
  isDisabled: Boolean;
  showBorders?: boolean;
}


const ETITimePicker2: React.FC<ETITimePicker2Props> = ({ value, onChange, isDisabled, showBorders = true }) => {
  
  const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: showBorders ? (value ? '#E68650' : '#FDE4AA') : 'transparent',
        borderWidth: showBorders ? 1 : 0,
      },
      '&:hover fieldset': {
        borderColor: showBorders ? '#E68650' : 'transparent',
      },
      '&.Mui-focused fieldset': {
        borderColor: showBorders ? '#E68650' : 'transparent',
      },
    },
  }));

  const handleBlur = (event) => {
    const time = event.target.value;
    const isValidTime = /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
    if (!isValidTime && time !== '') {
      console.log('Por favor, ingresa la hora en formato HH:MM');
      onChange('');
    }
  };


  return (
   
    <StyledTextField
    label=""
    type="time"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    onBlur={handleBlur}
    disabled={isDisabled}
    style={{ width: '102px', height: '48px', borderRadius: '12px'}}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <AccessTimeIcon sx={{ color: '#A82548', fontSize: 'large' }} />
        </InputAdornment>
      ),
    }}
    sx={{
      '& input[type="time"]::-webkit-calendar-picker-indicator': {
        display: 'none',
      },
    }}
  />
  );
};


export default ETITimePicker2;
