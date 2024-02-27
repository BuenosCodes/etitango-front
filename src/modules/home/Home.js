import * as React from 'react';
import Portada from './portada/Portada';
import Cronograma from './cronograma/Cronograma';
import { Box } from '@mui/material';

const ImgBackground = 'img/logo/eti-currentEvent.jpg';
function Index() {
  return (
   <Box sx={{display: 'flex', flexDirection: 'column'}}>
      <React.Fragment>
        <Portada />
        <img src={ImgBackground} alt="logo" width="100%" />
        <Cronograma />
      </React.Fragment>
    </Box>
  );
}

export default Index;
