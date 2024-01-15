/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import TextField from '@mui/material/TextField';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface ETITimePicker2Props {
  value: string;
  onChange: (value: string) => void;
}

const ETITimePicker2: React.FC<ETITimePicker2Props> = ({ value, onChange }) => {
  const handleBlur = (event) => {
    const time = event.target.value;
    const isValidTime = /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
    if (!isValidTime && time !== '') {
      console.log('Por favor, ingresa la hora en formato HH:MM');
      onChange('');
    }
  };

  return (
    <TextField
      label="Hora"
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={handleBlur}
      style={{ width: '115px', height: '48px', }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton size="small" edge="start">
              <AccessTimeIcon style={{color: '#A82548'}}/>
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};


export default ETITimePicker2;
