import React, { useEffect, useState } from 'react';
import { UserFullData, UserRolesListData } from 'shared/User';
import { getAllUsers } from 'helpers/firestore/users';
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef,
  GridToolbarQuickFilter
} from '@mui/x-data-grid';
import { useGlobalState } from 'helpers/UserPanelContext';
import EtiButton from 'components/button/EtiButton';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n';

const RolesNewEvent = ({
  handleClose,
  selectedRows
}: {
  handleClose: Function;
  selectedRows: any;
}) => {
  const { isMobile } = useGlobalState();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserFullData[]>([]);
  const [selectedUserInfo, setSelectedUserInfo] = React.useState({});
  const [filteredUsers, setFilteredUsers] = useState<UserFullData[]>([]);
  const [selectedDataTable, setSelectedDataTable] = React.useState([]);
  const { t } = useTranslation([SCOPES.COMMON.FORM, SCOPES.MODULES.ETI], { useSuspense: false });

  useEffect(() => {
    setIsLoading(true);
    let user: Function;

    const fetchData = async () => {
      try {
        user = await getAllUsers(setUsers, setIsLoading);
      } catch (error) {
        alert('Error getting users:' + error);
      }
    };

    fetchData();
    return () => {
      if (user) {
        user();
      }
    };
  }, []);

  useEffect(() => {
    const adminsSelected = selectedRows.map((item: any) => item.id);
    setSelectedDataTable(adminsSelected);
    const filteredData = users.filter((usuario) => {
      return !usuario.roles || !usuario.roles.superadmin;
    });
    setFilteredUsers(filteredData);
  }, [users, selectedRows]);

  const columns: GridColDef[] = 
  isMobile ? [
        {
          field: t('nameFirst'),
          flex: 1,
          headerClassName: 'super-app-theme--header'
        },
        {
          field: t('email'),
          flex: 1,
          headerClassName: 'super-app-theme--header'
        },
        {
          ...GRID_CHECKBOX_SELECTION_COL_DEF,
          width: 30
        }
      ]
    : [
        {
          field: t('nameFirst'),
          flex: 1,
          headerClassName: 'super-app-theme--header'
        },
        {
          field: t('nameLast'),
          flex: 1,
          headerClassName: 'super-app-theme--header'
        },
        {
          field: t('email'),
          flex: 1,
          headerClassName: 'super-app-theme--header'
        }
      ];

  const getUserDataValues = ({ nameFirst, nameLast, id, email }: UserRolesListData) => {
    return {
      id,
      Email: email,
      Nombre: isMobile ? `${nameFirst} ${nameLast}` : nameFirst,
      Apellido: nameLast
    };
  };

  const handleSelectEmails = async () => {
    try {
      setIsLoading(true);
      handleClose(selectedUserInfo);
    } catch (error) {
      alert('Error passing selected users:' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DataGrid
        rows={filteredUsers.map(getUserDataValues)}
        columns={columns}
        loading={isLoading}
        initialState={{
          sorting: {
            sortModel: [{ field: 'Nombre', sort: 'asc' }]
          }
        }}
        checkboxSelection
        hideFooter={true}
        pageSize={5}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
        components={{
          Toolbar: ({ ...props }) => (
            <GridToolbarQuickFilter
              {...props}
              placeholder="Buscar"
              variant="outlined"
              sx={{ display: 'flex', borderColor: 'details.peach', borderRadius: '4px', mb: 2 }}
            />
          )
        }}
        getRowId={(row) => row.id}
        selectionModel={selectedDataTable}
        onSelectionModelChange={(selection: any) => {
          const selectedInfo = selection.map((selectedId: any) => {
            const selectedUsuario = users.find((usuario) => usuario.id.toString() === selectedId);
            return selectedUsuario
              ? {
                  id: selectedId,
                  name: `${selectedUsuario?.nameFirst} ${selectedUsuario?.nameLast}`,
                  email: selectedUsuario.email
                }
              : '';
          });
          setSelectedDataTable(selection);
          setSelectedUserInfo(selectedInfo);
        }}
        sx={{
          mt: 4,
          borderColor: 'background.white',
          '& .MuiInputBase-input': {
            padding: '10px 12px 10px 12px'
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderWidth: '1.5px',
              borderColor: 'details.peach',
              pointerEvents: 'none'
            },
            '&:hover fieldset ': {
              borderColor: 'details.peach',
              pointerEvents: 'none'
            },
            '&.Mui-focused fieldset': {
              borderColor: 'details.peach',
              pointerEvents: 'none'
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'details.peach'
            }
          },
          '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
            display: 'none'
          },
          '& .MuiDataGrid-virtualScroller': {
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'principal.primary',
              borderRadius: '12px'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
              boxShadow: '1px 0px 2px 0px #6695B7',
              borderRadius: '12px'
            }
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'principal.primary',
            color: 'greyScale.50',
            fontSize: '16px',
            lineHeight: '16px',
            fontFamily: 'Montserrat',
            fontWeight: 600
          },
          '& .css-1yi8l0w-MuiButtonBase-root-MuiCheckbox-root': {
            color: 'principal.secondary'
          },
          '& .MuiDataGrid-row:nth-of-type(even)': {
            backgroundColor: 'details.aliceBlue'
          },
          '& .MuiDataGrid-cellContent': {
            color: 'details.frenchBlue',
            fontSize: '16px',
            lineHeight: '16px',
            fontFamily: 'Roboto',
            fontWeight: 400
          }
        }}
      />

      <EtiButton isSubmitting={null} isLoading={isLoading} title={t('eti.addButton')} styleKey="primaryButton" onClick={handleSelectEmails} isCenter={true}/>
    </>
  );
};
export default RolesNewEvent;
