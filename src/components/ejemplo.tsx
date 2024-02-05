/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const initialRows = [
  { id: 1, name: 'Row 1', age: 30 },
  { id: 2, name: 'Row 2', age: 25 },
  // ...more rows
];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'age', headerName: 'Age', width: 150 },
  // ...more columns
];

const MyDataGrid: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});

  const handleRowClick = (id: number) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [id]: !prevExpandedRows[id],
    }));
  };

  const renderSubRow = (id: number) => {
    if (expandedRows[id]) {
      // Aquí puedes devolver el contenido de la subfila
      return (
        <div style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
          Subrow content for ID: {id}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={initialRows}
        columns={columns}
        pageSize={5}
        onRowClick={(row) => handleRowClick(row.id as number)}
        components={{
          Row: ({ row }) => (
            <React.Fragment>
              {renderSubRow(row.id as number)}
              <div style={{ cursor: 'pointer' }} onClick={() => handleRowClick(row.id as number)}>
                {row.name} - {row.age}
              </div>
            </React.Fragment>
          ),
        }}
      />
    </div>
  );
};

export default MyDataGrid;