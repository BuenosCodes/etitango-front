/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, Menu, MenuItem, } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { createOrUpdateDoc } from 'helpers/firestore'; 

const ETIMercadoPago = ( { idEvent }) => {
  const [rows, setRows] = useState([]);
  const [editRowsModel, setEditRowsModel] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [idCounter, setIdCounter] = useState(0);

  const rowHeight = 23;
  const headerHeight = 23;
  const totalHeight = rows.length * rowHeight + headerHeight;
  
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
    const updateRows = rows.map((row) => {
      const edits = editRowsModel[row.id];
      return edits ? {...row, ...edits} : row;
    });
    setRows(updateRows);

    setIdCounter(idCounter + 1);
    const newRow = { id: idCounter, link: ''};
    setRows((prevRows) => [...prevRows, newRow]);
  };
  

  const handleRemoveRow = () => {
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
    { field: 'link', headerName: 'Link de cobro',width: 870, editable: true },
  ];

  const save = async () => {
    try {
      const id = idEvent
      const linkMercadoPago = rows
      const eventId = await createOrUpdateDoc('events', {linkMercadoPago: linkMercadoPago}, id === 'new' ? undefined : id);
      //console.log('la id del evento ', eventId);
    } catch (error) {
      console.log('Error la enviar alojamiento', error);
    }
  };

  return (
    <Box sx={{display: 'flex', mt: 2}}>
      <Grid container rowSpacing={0} columnSpacing={{ md: 0 }}>
        <Grid item xs={10}>
          <Typography variant='h6' fontWeight="600">Mercadopago</Typography>
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {isEditing && (
            <Button
              variant='contained'
              style={{ background: 'transparent', boxShadow: 'none', border: 'none', margin: 0 }}
              onClick={() => save()}
            >
              <img src={'/img/icon/btnConfirm.svg'} alt="btnDelete" style={{ width: '100%', height: 'auto' }} />
            </Button>
          )}
          
          <Button
            variant='contained'
            style={{ background: 'transparent', boxShadow: 'none', border: 'none', margin: 0 }}
            onClick={handleMenuClick}
          >
            <img src={'/img/icon/btnTresPuntos.svg'} alt="btnOptions" style={{ width: '100%', height: 'auto' }} />
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
            <img src={'/img/icon/btnPlus.svg'} alt="btnAdd" style={{ width: '100%', height: 'auto' }} />
          </Button>
        </Grid>
        <Grid container>
          <Grid item xs={12} sx={{ height: `${totalHeight}px`, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              editRowsModel={editRowsModel}
              onEditRowsModelChange={setEditRowsModel}
              localeText={{ noRowsLabel: ''}}
              hideFooter = {true}
              rowHeight={22}
              headerHeight={22}
              disableColumnMenu={true}
              disableExport={true}
              filterable={false}
              flex={2}
              sx={{
                mb: 2,
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

export default ETIMercadoPago;