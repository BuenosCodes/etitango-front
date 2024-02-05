/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import ModalForm from './ModalForm';

const EditEventsTable = ({ title, subtitles }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  let itemSize;
  switch (subtitles.length) {
    case 1:
        itemSize = 12;
        break;
    case 2: 
        itemSize = [4, 8];
        break;
    case 3: 
        itemSize = 4;
        break;
    case 4: 
        itemSize = 12;
        break;
}
  return (
    <Box sx={{
      margin: 2,
      display: 'flex',
      width: '95%',
    }}>
      <Grid container rowSpacing={0} columnSpacing={{ md: 0 }}>
        <Grid item xs={10}>
          <Typography variant='h6' fontWeight="600">{title}</Typography>
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            style={{ background: 'transparent', boxShadow: 'none', border: 'none', margin: 0 }}
          >
            <img src={'/img/icon/btnTresPuntos.png'} alt="" style={{ width: '100%', height: 'auto' }} />
          </Button>
          <Button
            variant='contained'
            style={{ background: 'transparent', boxShadow: 'none', border: 'none', margin: 0 }}
            onClick={handleOpenModal}
          >
            <img src={'/img/icon/btnPlus.png'} alt="btnAdd" style={{ width: '100%', height: 'auto' }} />
          </Button>
          <ModalForm open={isModalOpen} onClose={handleCloseModal} />
        </Grid>
        <Grid container>
          {subtitles.map((subtitle, index) => (
            <Grid 
              key={index} 
              item 
              xs={Array.isArray(itemSize) ? itemSize[index] : itemSize} 
              sx={{ backgroundColor: '#5FB4FC', padding: '1px'}}
            >
              <Typography variant="subtitle2" fontWeight="600" color='white'>{subtitle}</Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditEventsTable;
