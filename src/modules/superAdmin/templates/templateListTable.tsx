import React from 'react';
import { Button, Paper } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../App';
import { Template } from '../../../helpers/firestore/templates';

export function TemplateListTable(props: { templates: Template[]; isLoading: boolean }) {
  const { templates, isLoading } = props;

  const { t } = useTranslation([SCOPES.COMMON.FORM], {
    useSuspense: false
  });
  const navigate = useNavigate();
  const viewButton = {
    field: 'view',
    headerName: 'view',
    sortable: false,
    width: 300,
    renderCell: (params: GridRenderCellParams<String>) => (
      <strong>
        <Button
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          tabIndex={params.hasFocus ? 0 : -1}
          onClick={() => navigate(`${ROUTES.SUPERADMIN}${ROUTES.TEMPLATES}/${params.row.id}`)}
        >
          Ver
        </Button>
      </strong>
    )
  };

  const columns: GridColDef[] = templates[0]
    ? Object.keys(templates[0]).map((fieldName) => ({
        field: fieldName,
        headerName: t(fieldName),
        width: 300
      }))
    : [];
  columns.push(viewButton);

  return (
    <>
      <Paper style={{ height: '100vh', marginTop: 3 }}>
        <DataGrid rows={templates} columns={columns} loading={isLoading} />
      </Paper>
    </>
  );
}

export default TemplateListTable;
