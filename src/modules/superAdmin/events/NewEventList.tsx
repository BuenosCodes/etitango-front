/* eslint-disable prettier/prettier */
import { Button, Paper, Box, Typography, Grid, PaginationItem } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { EtiEvent } from 'shared/etiEvent';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";

export function NewEventList(props: { events: EtiEvent[]; isLoading: boolean, onDeleteEvent: (id: string) => Promise<void>, onSelectEvent: Function }) {
  const { events, isLoading, onDeleteEvent, onSelectEvent } = props;

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

  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <Pagination
        color='secondary'
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              fontWeight: 600,
              borderRadius: '100px',
              fontSize: '12px',
              minWidth: '24px',
              minHeight: '24px',
              height: '24px',
              width: '24px',
              backgroundColor: item.page === page + 1 ? '#0075D9' : '#5FB4FC',
              color: item.page === page + 1 ? '#FAFAFA' : '#FAFAFA',
              '&:hover': {
                backgroundColor: item.page === page + 1 ? '#0075D9' : '#5FB4FC',
              },
            }}
          />
        )}
      />
    );
  }


  return (
    <>
    <Box
      sx={{display: 'flex', flexDirection: 'column', overflow: 'auto', width: '960px', height: '290px', boxShadow: 3, borderRadius: '12px', backgroundColor: '#FFFFFF'}}
    >

      
      
              <Box sx={{ color: '#FFFFFF', backgroundColor: '#4B84DB', padding: '12px 24px 12px 24px', fontWeight: 600, fontSize: '24px', lineHeight: '16px', fontFamily: 'Montserrat', height: '40px' }}>
                ETIs
              </Box>
      
        <DataGrid
        rows={sortedEvents.map(getEtiEventValues)} 
        columns={columns} 
        loading={isLoading}
        components={{
          Pagination: CustomPagination,
        }}
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
          m: '20px',
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
      
      </Box>
    </>
  );
}

export default NewEventList;
