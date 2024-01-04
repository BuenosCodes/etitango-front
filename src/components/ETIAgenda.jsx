/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import ModalForm from './ModalForm';
import ETITable from './ETITable';
import MyDataGrid from './ejemplo';


const ETIAgenda = ({ dateStart, name, additionalFields }) => {

  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  console.log('datos traidos -> ', dateStart, name, additionalFields);

  return (
    <Box sx={{
      margin: 2,
      display: 'flex',
      width: '95%',
    }}>
      <Grid container rowSpacing={0} columnSpacing={{ md: 0 }}>
        <Grid item xs={10}>
          <Typography variant='h6' fontWeight="600">Agenda</Typography>
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
            <Grid item xs={4} sx={{ backgroundColor: '#5FB4FC', padding: '1px'}}>
              <Typography variant="subtitle2" fontWeight="600" color='white'>Fecha</Typography>
            </Grid>
            <Grid item xs={8} sx={{ backgroundColor: '#5FB4FC', padding: '1px'}}>
              <Typography variant="subtitle2" fontWeight="600" color='white'>Descripcion</Typography>
            </Grid>
        </Grid>
        {/* <CollapsibleTable /> */}
        {/* <ETITable dateStart={dateStart} name={name} additionalFields={additionalFields} /> */}
      </Grid>
    </Box>
  );
};

export default ETIAgenda;
