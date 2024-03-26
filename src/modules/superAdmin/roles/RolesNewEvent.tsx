/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useContext } from 'react';
import { UserFullData, UserRolesListData } from 'shared/User';
import { getAllUsers } from 'helpers/firestore/users';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { useGlobalState } from 'helpers/UserPanelContext';

const RolesNewEvent = ({ handleClose, selectedRows }: { handleClose: Function, selectedRows: any }) => {

    const {isMobile} = useGlobalState();
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<UserFullData[]>([]);
    const [selectedUserInfo, setSelectedUserInfo] = React.useState({});
    const [filteredUsers, setFilteredUsers] = useState<UserFullData[]>([]);
    const [selectedDataTable, setSelectedDataTable] = React.useState([]);

    useEffect(() => {
        setIsLoading(true);
        let user: Function;

        const fetchData = async () => {
            try {
                user= await getAllUsers(setUsers, setIsLoading);
            } catch (error) {
                alert('Error getting users:' + error);
            }
        };
        
        fetchData();
        return () => {
            if (user) {
                user()
            }
        };
    }, []);

    useEffect(() => {
        const adminsSelected = selectedRows.map((item:any) => item.id);
        setSelectedDataTable(adminsSelected)
        const filteredData = users.filter((usuario) => {
            return !usuario.roles || !usuario.roles.superadmin;
        });
        setFilteredUsers(filteredData);
    }, [users, selectedRows]);
 
    const columns: GridColDef[] = 
    isMobile ? 
    [
        {
            field: 'Nombre',
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'Email',
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        {
            ...GRID_CHECKBOX_SELECTION_COL_DEF,
            width: 30
        }
    ]

    :

    [
        {
            field: 'Nombre',
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'Apellido',
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'Email',
            flex: 1,
            headerClassName: 'super-app-theme--header',
        },
    ];

    const getUserDataValues = ({ nameFirst, nameLast, id, email }: UserRolesListData) => {
        return { id, Email: email, Nombre: isMobile ? `${nameFirst} ${nameLast}` : nameFirst, Apellido: nameLast };
    };

    const handleSelectEmails = async () => {
        try {
            setIsLoading(true);
            handleClose(selectedUserInfo)
        } catch (error) {
            alert('Error passing selected users:' + error);
        } finally {
            setIsLoading(false);
        }
    };

    const scrollbarStyles = {
        '&::-webkit-scrollbar': {
            width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'principal.primary',
            borderRadius: '12px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
            boxShadow: '1px 0px 2px 0px #6695B7',
            borderRadius: '12px',
        },
    };

    return (
        <>
            <DataGrid
                rows={filteredUsers.map(getUserDataValues)}
                columns={columns}
                loading={isLoading}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'Nombre', sort: 'asc' }],
                    },
                }}
                checkboxSelection
                hideFooter={true}
                pageSize={5}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                components={{
                    Toolbar: ({ ...props }) => (
                        <GridToolbarQuickFilter {...props} placeholder='Buscar' variant='outlined' sx={{ display: 'flex', borderColor: 'details.peach', borderRadius: '4px', mb: 2 }} />
                    ),
                }}
                getRowId={(row) => row.id}           
                selectionModel={selectedDataTable}
                onSelectionModelChange={(selection:any) => {
                    const selectedInfo = selection.map((selectedId: any) => {
                        const selectedUsuario = users.find((usuario) => usuario.id.toString() === selectedId);
                        return selectedUsuario ? {id: selectedId, name: `${selectedUsuario?.nameFirst} ${selectedUsuario?.nameLast}`, email: selectedUsuario.email } : '';
                    })
                    setSelectedDataTable(selection)     
                    setSelectedUserInfo(selectedInfo)
                }}
                sx={{
                    mt: 4,
                    borderColor: 'background.white',
                    '& .MuiInputBase-input': {
                        padding: '10px 12px 10px 12px',
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
                            borderColor: 'details.peach',
                        }
                    },
                    "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
                        display: "none"
                    },
                    '& .MuiDataGrid-virtualScroller': {
                        ...scrollbarStyles
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
                        color: 'principal.secondary',
                    },
                    '& .MuiDataGrid-row:nth-of-type(even)': {
                        backgroundColor: 'details.aliceBlue', // Color para filas pares
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

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button sx={{ width: '115px', padding: '12px, 32px, 12px, 32px', borderRadius: '25px', backgroundColor: 'principal.secondary', height: '44px', '&:hover': { backgroundColor: 'principal.secondary' } }} onClick={() => { handleSelectEmails() }}>
                    <Typography sx={{ color: 'greyScale.50', fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}>
                        {isLoading ? <CircularProgress sx={{ color: 'background.white' }} size={30}/> : 'Agregar'}
                    </Typography>
                </Button>
            </Box>
        </>
    );
};
export default RolesNewEvent;