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
  useGridSelector,
  GridFooterContainer,
  GridSelectionModel,
  GRID_CHECKBOX_SELECTION_COL_DEF
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import { makeStyles } from '@mui/styles';
import Checkbox from '@mui/material/Checkbox';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from 'etiFirebase';


const useStyles = makeStyles({
  root: {
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
    '& .MuiDataGrid-cell:focus-within': {
      outline: 'none',
    },

  }
});


export function NewEventList(props: { events: EtiEvent[]; isLoading: boolean, onDeleteEvent: (id: string) => Promise<void>, onSelectEvent: Function, selectedRows : string[], setSelectedRows : Function }) {
  const { events, isLoading, onDeleteEvent, onSelectEvent, selectedRows, setSelectedRows } = props;
  // const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const fields = events[0] ? Object.keys(events[0]) : [];
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showCheckbox, setShowCheckbox] = useState(false)
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.dateStart).getTime();
    const dateB = new Date(b.dateStart).getTime();
    return dateB - dateA;
  });

  
  const classes = useStyles();
  

  const columns: GridColDef[] = [ 
    
    {
      field: 'dateStart',
      headerName: 'Fecha',
      width: 250,
      cellClassName: 'custom-date-cell',
    },
    {
    field: 'name',
    headerName: 'Nombre',
    width: 600,
    cellClassName: 'custom-date-cell',
   
  },
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    width: 50,
    renderHeader: () => <></>
  },
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

  function CustomFooter() {
    const handleDeleteButtonClick = async () => {
      try {
        if (selectedRows.length > 0) {
          await Promise.all(selectedRows.map((eventId) => onDeleteEvent(eventId)));
          setSelectedRows([]);
          setShowCheckbox(false);
        }
        if (selectedRows.length === 0) {
          setShowCheckbox(false);
        }
      } catch (error) {
        console.error('Error al eliminar eventos:', error);
      }
    };
  
    return (
      <Grid >
        {!showCheckbox ? (
        <Button onClick={() => setShowCheckbox(!showCheckbox)}>
            <img src="/img/icon/btnDelete.svg" alt="Icono Trash" />
            </Button>
          ) : (
            <Button onClick={handleDeleteButtonClick}>
            {/* Aquí puedes agregar el mismo ícono si lo prefieres */}
            <img src="/img/icon/btnTrashWhite.svg" alt="Icono Borrar" />
          </Button>
          )}
      </Grid>
    );
  }
 

  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    
    return (
     
      <Pagination
        color='secondary'
        count={pageCount}
        page={page + 1}
        sx={{mt: 2}}
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

  function CustomContainer() {
    return (
      <Grid container>
        <Grid item xs={6}> <CustomFooter /></Grid>
        <Grid item xs={6} >
          <Box sx={{display: 'flex', justifyContent: 'flex-end', mr: 2}}>
            <CustomPagination />
          </Box>
          </Grid>
      </Grid>
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
        className={classes.root}
        rows={sortedEvents.map(getEtiEventValues)} 
        columns={columns}
        loading={isLoading}
        checkboxSelection={showCheckbox}
        disableSelectionOnClick={!showCheckbox}
        components={{
          Pagination: CustomContainer,
          
        }}
        onRowClick={(event) => {
          const selectedEventId = event.row.id as string;
          const isSelected = selectedRows.includes(selectedEventId);
      
          if (isSelected) {
            
            setSelectedRows((prevSelectedRows : string[]) =>
              prevSelectedRows.filter((rowId) => rowId !== selectedEventId)
            );
          } else {
            
            setSelectedRows((prevSelectedRows : string[]) => [selectedEventId]);
          }
      
          const selectedEvent = events.find((event) => event.id === selectedEventId);
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
          '& .MuiDataGrid-row': {
            '&.Mui-selected': {
              border: '2px solid #A82548',
              backgroundColor: 'inherit'
            },
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'transparent',
          },
          '& .MuiDataGrid-row.Mui-selected:hover': {
            backgroundColor: 'inherit'
          },
          '& .MuiDataGrid-row.Mui-selected:nth-of-type(even):hover': {
            backgroundColor: '#DBEEFF', 
          },
          '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: '#DBEEFF'
          },
          '& .MuiDataGrid-cellContent': {
              color: '#0075D9',
              fontSize: '16px',
              lineHeight: '16px',
              fontFamily: 'Inter',
              fontWeight: 400,
          },
          '& .css-1yi8l0w-MuiButtonBase-root-MuiCheckbox-root': {
            color: '#EE4254',
            border: '1px',
            '&.Mui-checked': {
              border: '1.5px',
              color: '#A82548',
              backgroundColor: 'transparent', 
            },
          
          }

      }}
      hideFooterSelectedRowCount={true}
      selectionModel={selectedRows}
      onSelectionModelChange={(newSelection) => {
        setSelectedRows(newSelection as string[]);
        console.log("IDs: " , newSelection)
      }}
        />
       
      </Box>
    </>
  );
}

export default NewEventList;
