/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Box, Button, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { makeStyles } from "@mui/styles";
import ModalForm from './ModalForm';
const ETIAgenda = ( { idEvent } ) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const data = [
    { fecha: '29/01/2024', descripcion: 'Evento 1', horarios: [{ hora: '12:30', actividad: 'Comida' }] },
    { fecha: '22/02/2024', descripcion: 'Evento 2', horarios: [{ hora: '23:30', actividad: 'Limpiar' }] },
  ];

  const handleClick = (index) => {
    setOpen(prevOpen => ({
      ...prevOpen,
      [index]: !prevOpen[index],
    }));
  };

  const useStyles = makeStyles({
    table: {
      "& .MuiTableCell-root": {
        // Estilos para todas las celdas
        height: '0px',
        padding: '0',
        //color: '#fff', // Cambia el color del texto
        fontFamily: "Roboto",
      },
      "& .MuiTableHead-root": {
        // Estilos para el encabezado de la tabla
        backgroundColor: "#5FB4FC", // Cambio de color de fondo para el encabezado
        color: "#000",
      },

      "& .MuiTableRow-root": {
          '&:nth-of-type(odd)': {
            //backgroundColor: '#f2f2f2', // Cambia el color de fondo para las filas impares
        },
      },
    },
  });
  
  const classes = useStyles();

  return (
    <Box sx={{display: 'flex', mt: 2}}>
      <Grid container rowSpacing={0} columnSpacing={{ md: 0 }}>
        <Grid item xs={10}>
          <Typography variant='h6' fontWeight="600">Agenda</Typography>
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            style={{ background: 'transparent', boxShadow: 'none', border: 'none', margin: 0 }}
          >
            <img src={'/img/icon/btnTresPuntos.svg'} alt="" style={{ width: '100%', height: 'auto' }} />
          </Button>
          <Button
            variant='contained'
            style={{ background: 'transparent', boxShadow: 'none', border: 'none', margin: 0 }}
            onClick={handleOpenModal}
          >
            <img src={'/img/icon/btnPlus.svg'} alt="btnAdd" style={{ width: '100%', height: 'auto' }} />
          </Button>
          <ModalForm idEvent={idEvent} open={isModalOpen} onClose={handleCloseModal} />
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper} className={classes.table}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell >Fecha</TableCell>
                  <TableCell >Descripción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleClick(index)}>
                          {open[index] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                      <TableCell>{row.fecha}</TableCell>
                      <TableCell>{row.descripcion}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Collapse in={open[index]}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Horario</TableCell>
                                <TableCell>Actividad</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {row.horarios.map((horaRow, horaIndex) => (
                                <TableRow key={horaIndex}>
                                  <TableCell sx={{color: '#000'}}>{horaRow.hora}</TableCell>
                                  <TableCell>{horaRow.actividad}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};
export default ETIAgenda;