import { Box, Typography } from '@mui/material';
import * as React from 'react';

// eslint-disable-next-line no-undef
const ImgBackground = process.env.PUBLIC_URL + '/img/h/login-background.jpg';

export default function Portada() {
  return (
    <React.Fragment>
      <Box
        sx={{
          backgroundImage: `url(${ImgBackground})`,
          backgroundColor: '#7fc7d9',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          height: '625px',
          padding: '25px',
          boxShadow: 'inset 0 0 0 50vw rgba(0, 0, 0, 0.5);',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography color="white" variant="h6" textAlign="center">
          RosarigasETI - 27, 28 y 29 de Octubre de 2023
        </Typography>
      </Box>
    </React.Fragment>
  );
}
