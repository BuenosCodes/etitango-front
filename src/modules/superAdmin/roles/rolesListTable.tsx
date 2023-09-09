import React from 'react';
import { Button, Paper } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';
import { UserRoles, UserRolesListData } from 'shared/User';
import { removeSuperAdmin, unassignEventAdmin } from '../../../helpers/firestore/users';

export function RolesListTable(props: {
  users: UserRolesListData[];
  isLoading: boolean;
  eventId?: string;
}) {
  const { users, isLoading, eventId } = props;

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
        {eventId ? (
          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: 16 }}
            tabIndex={params.hasFocus ? 0 : -1}
            onClick={() => unassignEventAdmin(params.row.email, eventId)}
          >
            Quitar ADMIN
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: 16 }}
            tabIndex={params.hasFocus ? 0 : -1}
            onClick={() => removeSuperAdmin(params.row.email)}
          >
            Quitar SUPERADMIN
          </Button>
        )}
      </strong>
    )
  };

  const columns: GridColDef[] = ['id', 'email', 'admin', 'superadmin']?.map((fieldName) => ({
    field: fieldName,
    headerName: t(fieldName),
    width: 300
  }));
  columns.push(removeRoleButtons);

  const getUserDataValues = ({ id, email, roles, adminOf }: UserRolesListData) => {
    return { id, email, admin: adminOf, [UserRoles.SUPER_ADMIN]: roles?.[UserRoles.SUPER_ADMIN] };
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
