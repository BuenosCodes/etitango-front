/* eslint-disable prettier/prettier */
import React from 'react';
import { Button, Paper } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { EtiEvent } from 'shared/etiEvent';
import { ROUTES } from '../../../App';
import { useNavigate } from 'react-router-dom';

export function EventListTable(props: { events: EtiEvent[]; isLoading: boolean }) {
  const { events, isLoading } = props;

  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.EVENT_LIST], {
    useSuspense: false
  });
  const navigate = useNavigate();

  const fields = events[0] ? Object.keys(events[0]) : [];
  const button = {
    field: 'edit',
    headerName: 'Edit',
    sortable: false,
    width: 100,
    renderCell: (params: GridRenderCellParams<String>) => (
      <strong>
        <Button
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          tabIndex={params.hasFocus ? 0 : -1}
          onClick={() => navigate(`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}${ROUTES.EDIT}/${params.row.id}`)}
        >
          Editar
        </Button>
      </strong>
    )
  };

  const columns: GridColDef[] = fields?.map((fieldName) => ({
    field: fieldName,
    headerName: t(fieldName),
    width: 120,
  }));
  columns.push(button);

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
      <Paper style={{ height: '100vh', marginTop: 3 }}>
        <DataGrid rows={events.map(getEtiEventValues)} columns={columns} loading={isLoading} />
      </Paper>
    </>
  );
}

export default EventListTable;
