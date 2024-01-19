/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { makeStyles } from "@mui/styles";
import ModalForm from './ModalForm';

const ETIAgenda = ( { idEvent, eventData } ) => {

  //console.log('EventData desde ETIAgenda -> ', eventData);

  // const eventDate = eventData?.date.toDate();
  // const eventDateTransform = eventDate?.toLocaleDateString();
  // console.log('esta es la fecha transformada: ', eventDateTransform);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [dataFromModalForm, setDataFromModalForm] = useState([]);
  const [agendaData, setAgendaData] = useState([]);
  const [updatedEvent, setUpdatedEvent] = useState();

  useEffect(() => {
    if (eventData && eventData?.Agenda) {
      setAgendaData(eventData?.Agenda.map((item) => ({
        description: item.description,
        date: item.date,
        schedule: item.schedule,
      })));
    } else {
      setAgendaData([]);
    }
  }, [eventData, updatedEvent]);
  

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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

  // useEffect(() => {
  //   console.log('ciudad desde ETIAgenda useEffect -> ', eventData.city);
  // },[])
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
          <ModalForm
            idEvent={idEvent}
            open={isModalOpen}
            onClose={handleCloseModal}
            setAgendaData={setAgendaData}
            setDataFromModalForm={setDataFromModalForm}
            setUpdatedEvent={setUpdatedEvent}
          />
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper} className={classes.table} >
            <Table>
              <TableHead >
                <TableRow >
                  <TableCell sx={{width: '1%'}}/>
                  <TableCell sx={{width: '240px', color: '#FFF'}}>Fecha</TableCell>
                  <TableCell sx={{width: '599px', color: '#FFF'}}>Descripción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agendaData.map((rowData, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleClick(index)}>
                          {open[index] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{color: '#0075D9'}}>{rowData.date}</TableCell>
                      <TableCell sx={{color: '#0075D9'}}>{rowData.description}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Collapse in={open[index]}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{width: '1%'}}/>
                                <TableCell sx={{width: '240px', color: '#FFF'}}>Horario</TableCell>
                                <TableCell sx={{width: '599px', color: '#FFF'}}>Actividad</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rowData.schedule.map((scheduleItem, scheduleIndex) =>(
                                <TableRow key={scheduleIndex}>
                                  <TableCell sx={{width: '6%'}}/>
                                  <TableCell sx={{width: '240px', color: '#0075D9'}}>{scheduleItem.time}</TableCell>
                                  <TableCell sx={{width: '599px', color: '#0075D9'}}>{scheduleItem.activity}</TableCell>
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