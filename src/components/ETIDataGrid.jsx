/* eslint-disable prettier/prettier */
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';

const DataTable = () => {
  const [rows, setRows] = useState([
    { id: 1, nombre: '', alias: '', cbu_cvu: '' },
  ]);

  const columns = [
    { field: 'nombre', headerName: 'Nombre', width: 333, editable: true },
    { field: 'alias', headerName: 'Alias', width: 333, editable: true },
    { field: 'cbu_cvu', headerName: 'CBU/CVU', width: 443, editable: true },
  ];

  const handleEditCellChangeCommitted = React.useCallback(
    ({ id, field, props }) => {
      const data = props;
      const updatedRows = rows.map((row) => {
        if (row.id === id) {
          row[field] = data.value;
        }
        return row;
      });
      setRows(updatedRows);
    },
    [rows]
  );

  return (
    <div style={{ height: 46, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        onEditCellChangeCommitted={handleEditCellChangeCommitted}
        hideFooter = {true}
        rowHeight={22}
        headerHeight={22}
        disableColumnMenu={true}
        disableExport={true}
        filterable={false}
        flex={2}
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
    </div>
  );
}

export default DataTable;
