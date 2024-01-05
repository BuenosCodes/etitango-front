/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { Button, Paper, Box, Typography, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { EtiEvent } from 'shared/etiEvent';
import { ROUTES } from '../../../App';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { RFC_2822 } from 'moment';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from 'etiFirebase';
import { useState } from 'react';

export function NewEventList(props: { events: EtiEvent[]; isLoading: boolean, onDeleteEvent: (id: string) => Promise<void>, onSelectEvent: Function }) {
  const { events, isLoading, onDeleteEvent, onSelectEvent } = props;

  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.EVENT_LIST], {
    useSuspense: false
  });
  const navigate = useNavigate();

  const fields = events[0] ? Object.keys(events[0]) : [];
  const [currentPage, setCurrentPage] = useState<number>(1);
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
    width: 600,
  },
  {
    field: 'trash',
    headerName: '',
    width: 50,
    renderCell: (params: GridRenderCellParams) => (
      <img
        src={"/img/icon/trash.svg"}
        alt="Icono"
        onClick={() => {
          onDeleteEvent(params.id as string)
        }}
      />
    ),
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
    
    sx={{padding: '12px 0px 50px 0px'}}>

       <Paper 
       elevation={4}
       sx={{width: '123vh', height: '30vh', borderRadius: '15px'}} >

        <Grid item xs={12} sx={{ backgroundColor: '#4B84DB', height: '40px', borderTopLeftRadius: '15px', borderTopRightRadius: '15px'}}>
          <Typography sx={{fontSize: '24px', fontWeight: '600', color: '#FAFAFA', pl: '25px', pt: '3px'}} >
            ETIs
          </Typography>
        </Grid>
      <Paper elevation={0} sx={{ height: '21vh', width: '100%', padding: '6px 24px 0px 24px'}}>
      
        <DataGrid
        
          // onPageChange={(newPage : number) => setCurrentPage(newPage)}
          components={{
            Pagination: (paginationProps : any) => {
              const { page, setPage } = paginationProps;
              return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    style={{ margin: '0 4px', backgroundColor: '#0075D9', color: '#FAFAFA', border: 'none', borderRadius: '50%', width: '32px', height: '32px' }}
                  >
                    {'<'}
                  </button>
                  {[1, 2, 3, 4].map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      style={{
                        margin: '0 4px',
                        backgroundColor: pageNumber === page ? '#4B84DB' : '#0075D9',
                        color: pageNumber === page ? '#FAFAFA' : '#FAFAFA',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                      }}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === Math.ceil(sortedEvents.length / 5)}
                    style={{ margin: '0 4px', backgroundColor: '#0075D9', color: '#FAFAFA', border: 'none', borderRadius: '50%', width: '32px', height: '32px' }}
                  >
                    {'>'}
                  </button>
                </div>
              );
            },
          }}
        //   Footer: () => (
        //     <div style={{
        //       backgroundColor: '#5FB4FC',
        //       color: '#FAFAFA',
        //       padding: '8px',
        //       display: 'flex',
        //       justifyContent: 'space-between',
        //       alignItems: 'center',
        //     }}>
        //       <div>{`${sortedEvents.length} filas`}</div>
        //       <div>
        //         {/* Ajusta el estilo de los botones de paginación según tus preferencias */}
        //         <button style={{ margin: '0 4px', backgroundColor: '#0075D9', color: '#FAFAFA', border: 'none', borderRadius: '4px', padding: '4px 8px' }}>Anterior</button>
        //         <button style={{ margin: '0 4px', backgroundColor: '#0075D9', color: '#FAFAFA', border: 'none', borderRadius: '4px', padding: '4px 8px' }}>Siguiente</button>
        //       </div>
        //     </div>
        //   ),
        // }}
        // // // ...otras props 
        rows={sortedEvents.map(getEtiEventValues)} 
        columns={columns} 
        loading={isLoading}
        onRowClick={(event) => {
          const selectedEventId = event.row.id as string;
          const selectedEvent = events.find(event => event.id === selectedEventId);
          if (selectedEvent) {
            onSelectEvent(selectedEvent);
          }
        }}
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
              fontWeight: 400
          },
          '.MuiDataGrid-colCell': {
            borderRight: 'none'
          }
      }}
        />
        {/* <Button onClick={()=>onSelectEvent(['hola'])}> Click aqui </Button> */}
      </Paper>
      </Paper>
      </Box>
    </>
  );
}

export default NewEventList;
