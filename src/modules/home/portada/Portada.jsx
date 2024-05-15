import { Box, Typography } from '@mui/material';
import * as React from 'react';
import { useContext } from 'react';
import { EtiEventContext } from '../../../helpers/EtiEventContext';

// eslint-disable-next-line no-undef
const ImgBackground = '/img/h/login-background.jpg';

export default function Portada() {
  const { etiEvent } = useContext(EtiEventContext);

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
          {etiEvent?.landingTitle}
        </Typography>
      </Box>
    </React.Fragment>
  );
}
