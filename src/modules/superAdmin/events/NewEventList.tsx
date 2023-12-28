import React from 'react';
import { Button, Paper, Box, Typography, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { EtiEvent } from 'shared/etiEvent';
import { ROUTES } from '../../../App';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { RFC_2822 } from 'moment';

export function NewEventList(props: { events: EtiEvent[]; isLoading: boolean }) {
  const { events, isLoading } = props;

  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.EVENT_LIST], {
    useSuspense: false
  });
  const navigate = useNavigate();

  const fields = events[0] ? Object.keys(events[0]) : [];

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.dateStart).getTime();
    const dateB = new Date(b.dateStart).getTime();
    return dateB - dateA;
  });

  const columns: GridColDef[] = [ 
    {
      field: 'dateStart',
      headerName: 'Fecha',
      width: 250,
      
    },
    {
    field: 'name',
    headerName: 'Nombre',
    width: 100,
    
  },
  {
    field: 'icon',
    headerName: '',
    width: 400,
    renderCell: () => (
      <img src={"/img/icon/edit-2.svg"} alt="Icono" />
    )
  },
  {
    field: 'icondos',
    headerName: '',
    width: 100,
    renderCell: () => (
      <img src={"/img/icon/trash.svg"} alt="Icono" />
    )
  }
]
  

  const getEtiEventValues = (event: EtiEvent) => {
    let output: any = { ...event };
    const dateFields: (keyof EtiEvent)[] = ['dateStart', 'dateEnd', 'dateSignupOpen'];
    dateFields.forEach((field) => {
      if (event[field]) {
        output[field] = (event[field]! as Date).toLocaleDateString()!;
      }
    });
    return output;
  };

  return (
    <>
    <Box
    
    sx={{padding: '12px 24px 24px 24px'}}>

       <Paper 
       elevation={4}
       sx={{width: '101vh', height: '24vh', borderRadius: '15px'}} >

        <Grid item xs={12} sx={{ backgroundColor: '#4B84DB', height: '40px', borderTopLeftRadius: '15px', borderTopRightRadius: '15px'}}>
        <Typography sx={{fontSize: '24px', fontWeight: '600', color: '#FAFAFA', pl: '25px', pt: '3px'}} >
        ETIs
      </Typography>

        </Grid>
      
    
      <Paper elevation={0} sx={{ height: '16vh', width: '100%', padding: '6px 24px 0px 24px'}}>
      
        <DataGrid 
        rows={sortedEvents.map(getEtiEventValues)} 
        columns={columns} 
        loading={isLoading}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.id}
        rowHeight={22}
        headerHeight={22}
        pageSize={5}
        sx={{
          mb: 2,
          mt: 2,
          '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#5FB4FC',
              color: '#FAFAFA',
              fontSize: '16px',
              lineHeight: '16px',
              fontFamily: 'inter',
              fontWeight: 600
          },
          '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: '#DBEEFF', // Color para filas pares
          },
          '& .MuiDataGrid-cellContent': {
              color: '#0075D9',
              fontSize: '16px',
              lineHeight: '16px',
              fontFamily: 'Inter',
              fontWeight: 400,
          }
      }}
        />
        
      </Paper>
      </Paper>
      </Box>
    </>
  );
}

export default NewEventList;
