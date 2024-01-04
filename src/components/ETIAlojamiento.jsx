/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, Menu, MenuItem, } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { createOrUpdateDoc } from 'helpers/firestore'; 
import ETIModalMaps from './ETIModalMaps';

const ETIAlojamiento = () => {
  const [rows, setRows] = useState([]);
  const [editRowsModel, setEditRowsModel] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [idCounter, setIdCounter] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const updatedRows = rows.map((row) => {
      const edits = editRowsModel[row.id];
      if (edits) {
        const updatedEdits = Object.keys(edits).reduce((acc, key) => {
          acc[key] = edits[key].value;
          return acc;
        }, {});
        return { ...row, ...updatedEdits };
      }
      return row;
    });
    setRows(updatedRows);
  }, [editRowsModel]);
  
  

  const handleAddRow = () => {
    // setIdCounter(idCounter + 1);
    // const newRow = { id: idCounter, name: '', address: ''};
    // setRows((prevRows) => {
    //   const updatedRows = [...prevRows, newRow];
    //   console.log('rows after adding:', updatedRows);
    //   return updatedRows;
    // });
    const updateRows = rows.map((row) => {
      const edits = editRowsModel[row.id];
      return edits ? {...row, ...edits} : row;
    });
    setRows(updateRows);

    setIdCounter(idCounter + 1);
    const newRow = { id: idCounter, name: '', address: ''};
    setRows((prevRows) => [...prevRows, newRow]);
  };
  
  const handleRemoveRow = () => {
    // if(rows.length > 0){
    //   const newRows = rows.slice(0, -1);
    //   setRows(newRows);
    //   console.log('rows after removing:', newRows);
    // }
    const updatedRows = rows.map((row) => {
      const edits = editRowsModel[row.id];
      return edits ? {...row, ...edits} : row;
    });

    setRows(updatedRows);

    if (rows.length > 0){
      const newRows = rows.slice(0, -1);
      setRows(newRows)
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleConfirmClick = async () => {
    const updatedRows = Object.keys(editRowsModel).map((id) => {
      const row = rows.find((r) => r.id === parseInt(id));
      return { ...row, ...editRowsModel[id] };
    });
    for (const row of updatedRows) {
      await createOrUpdateDoc('', row, row.id);
    }
    setIsEditing(false);
  };

  const columns = [
    { field: 'name', headerName: 'Nombre del establecimiento',width: 350, editable: true },
    { field: 'address', headerName: 'Dirección de Google Maps', width: 760, editable: true },
  ];

  return (
    <Box sx={{ margin: 2, display: 'flex', width: '95%' }}>
      <Grid container rowSpacing={0} columnSpacing={{ md: 0 }}>
        <Grid item xs={10}>
          <Typography variant='h6' fontWeight="600">Alojamiento</Typography>
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {isEditing && (
            <Button
              variant='contained'
              style={{ background: 'transparent', boxShadow: 'none', border: 'none', margin: 0 }}
              onClick={handleConfirmClick}
            >
              <img src={'/img/icon/btnConfirm.png'} alt="btnDelete" style={{ width: '100%', height: 'auto' }} />
            </Button>
          )}
          <Button
            variant='contained'
            style={{ background: 'lightblue', boxShadow: 'none', border: 'none', margin: 0 }}
            onClick={handleOpenModal}
          >
            <img src={'/img/icon/btnOpenModalMaps.png'} alt="btnOpenModal" style={{ width: '100%', height: 'auto' }} />
          </Button>
          <ETIModalMaps isOpen={isModalOpen} handleCloseModal={handleCloseModal} />
          <Button
            variant='contained'
            style={{ background: 'transparent', boxShadow: 'none', border: 'none', margin: 0 }}
            onClick={handleMenuClick}
          >
            <img src={'/img/icon/btnTresPuntos.png'} alt="btnOptions" style={{ width: '100%', height: 'auto' }} />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEditClick}>Editar</MenuItem>
            <MenuItem onClick={handleRemoveRow}>Eliminar</MenuItem>
          </Menu>
          <Button
            variant='contained'
            style={{ background: 'transparent', boxShadow: 'none', border: 'none', margin: 0 }}
            onClick={handleAddRow}
          >
            <img src={'/img/icon/btnPlus.png'} alt="btnAdd" style={{ width: '100%', height: 'auto' }} />
          </Button>
        </Grid>
        <Grid container>
          <Grid item xs={12} sx={{ height: 92, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              editRowsModel={editRowsModel}
              
              onEditRowsModelChange={setEditRowsModel}
              hideFooter = {true}
              rowHeight={22}
              headerHeight={22}
              disableColumnMenu={true}
              disableExport={true}
              filterable={false}
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
                    backgroundColor: '#DBEEFF',
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
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ETIAlojamiento;
