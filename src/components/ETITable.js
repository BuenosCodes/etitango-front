/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import { Box,Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon, KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';
import './ETIAgenda.css'
function createData(date, eventName, schedule) {
  return {
    date,
    eventName,
    schedule,
  };
}
function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' }}}>
        <TableCell sx={{width: '125px', padding: 0}}>{row.date}</TableCell>
        <TableCell sx={{width: '250px', padding: 0}}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{width: '125px', padding: 0}}>{row.eventName}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="schedule">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{width: '350px', padding: 0}}>Horario</TableCell>
                    <TableCell>Actividad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.schedule.map((scheduleRow, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ padding: 0}}>{scheduleRow.date}</TableCell>
                      <TableCell>{scheduleRow.activity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
Row.propTypes = {
  row: PropTypes.shape({
    date: PropTypes.string.isRequired,
    eventName: PropTypes.string.isRequired,
    schedule: PropTypes.arrayOf(
      PropTypes.shape({
        time: PropTypes.string.isRequired,
        activity: PropTypes.string.isRequired,
      }),
    ).isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default function ETITable({ dateStart, name, additionalFields }) {
  console.log('dateStart: ', dateStart, '\n', 
  'name: ', name, '\n', 
  'additionalFields TIME: ', additionalFields[0].time, '\n', 
  'additionalFields DESC: ', additionalFields[0].description,
  );

  const formattedDateStart = new Date(dateStart).toLocaleDateString();
  // const firstAdditionalField = additionalFields.length > 0 ? additionalFields[0] : {};
  // const formattedTime = new Date(firstAdditionalField.time).toLocaleDateString();
  const formattedSchedule = additionalFields.map(({ time, description }) => ({
    time: new Date(time).toLocaleTimeString(),
    activity: description,
  }));
  
  const row = createData(formattedDateStart, name, formattedSchedule);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableBody>
          <Row row={row} />
        </TableBody>
      </Table>
    </TableContainer>
  );
}