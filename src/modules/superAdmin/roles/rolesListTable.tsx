import React from 'react';
import { Button, Paper } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { UserRoles, UserRolesListData } from 'shared/User';

export function RolesListTable(props: {
  users: UserRolesListData[];
  isLoading: boolean;
  removeARole: Function;
}) {
  const { users, isLoading, removeARole } = props;

  const { t } = useTranslation([SCOPES.COMMON.FORM], {
    useSuspense: false
  });

  const removeRoleButtons = {
    field: 'removeRoles',
    headerName: 'Remove roles',
    sortable: false,
    width: 300,
    renderCell: (params: GridRenderCellParams<String>) => (
      <strong>
        <Button
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          tabIndex={params.hasFocus ? 0 : -1}
          onClick={() => removeARole(UserRoles.ADMIN, params.row.id)}
        >
          Quitar ADMIN
        </Button>
        <Button
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          tabIndex={params.hasFocus ? 0 : -1}
          onClick={() => removeARole(UserRoles.SUPER_ADMIN, params.row.id)}
        >
          Quitar SUPERADMIN
        </Button>
      </strong>
    )
  };

  const columns: GridColDef[] = ['id', 'email', 'admin', 'superadmin']?.map((fieldName) => ({
    field: fieldName,
    headerName: t(fieldName),
    width: 300
  }));
  columns.push(removeRoleButtons);

  const getUserDataValues = ({ id, email, roles }: UserRolesListData) => {
    return { id, email, admin: roles?.admin, superadmin: roles?.superadmin };
  };

  return (
    <>
      <Paper style={{ height: '100vh', marginTop: 3 }}>
        <DataGrid rows={users.map(getUserDataValues)} columns={columns} loading={isLoading} />
      </Paper>
    </>
  );
}

export default RolesListTable;
