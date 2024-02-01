/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { UserFullData, UserRolesListData } from 'shared/User';
import * as firestoreUserHelper from 'helpers/firestore/users';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarQuickFilter } from '@mui/x-data-grid';

const RolesNewEvent = ({ handleClose, selectedRows }: { handleClose: Function, selectedRows: any }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [usuarios, setUsuarios] = useState<UserFullData[]>([]);
    const [selectedUserInfo, setSelectedUserInfo] = React.useState({});
    const [filteredUsuarios, setFilteredUsuarios] = useState<UserFullData[]>([]);
    const [selecteTabledData, setSelectedTableData] = React.useState([]);

    useEffect(() => {
        setIsLoading(true);

        let usuarios2: Function;

        const fetchData = async () => {
            usuarios2 = await firestoreUserHelper.getAllUsers(setUsuarios, setIsLoading)
        };
        fetchData().catch((error) => {
            console.error(error);
        });
        return () => {
            if (usuarios2) {
                usuarios2()
            }
        };
    }, []);

    useEffect(() => {
        const adminsSelected = selectedRows.map((item:any) => item.id);
        setSelectedTableData(adminsSelected)
        const filteredData = usuarios.filter((usuario) => {
            return usuario.roles && usuario.roles.superadmin !== true;
        });
        setFilteredUsuarios(filteredData);
    }, [usuarios, selectedRows]);
 
 const columns: GridColDef[] = [
        {
            field: 'Nombre',
            width: 150,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'Apellido',
            width: 150,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'Email',
            width: 250,
            headerClassName: 'super-app-theme--header',
        },
    ];

    const getUserDataValues = ({ nameFirst, nameLast, id, email }: UserRolesListData) => {
        return { id, Email: email, Nombre: nameFirst, Apellido: nameLast };
    };

    const handleSelectEmails = async () => {
        try {
            setIsLoading(true);
            handleClose(selectedUserInfo)
        } catch (error) {
            console.error('Error al pasar los de usuarios seleccionados:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const scrollbarStyles = {
        // overflowY: 'auto',
        '&::-webkit-scrollbar': {
            width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#C0E5FF',
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
                rows={filteredUsuarios.map(getUserDataValues)}
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
                        <GridToolbarQuickFilter {...props} placeholder='Buscar' variant='outlined' sx={{ display: 'flex', borderColor: '#FDE4AA', borderRadius: '4px', mb: 2 }} />
                    ),
                }}
                getRowId={(row) => row.id}           
                selectionModel={selecteTabledData}
                onSelectionModelChange={(selection:any) => {
                    const selectedInfo = selection.map((selectedId: any) => {
                        const selectedUsuario = usuarios.find((usuario) => usuario.id.toString() === selectedId);
                        return selectedUsuario ? {id: selectedId, name: `${selectedUsuario?.nameFirst} ${selectedUsuario?.nameLast}`, email: selectedUsuario.email } : '';
                    })
                    setSelectedTableData(selection)     
                    setSelectedUserInfo(selectedInfo)
                }}
                sx={{
                    mb: 2,
                    mt: 2,
                    borderColor: '#ffffff',
                    '& .MuiInputBase-input': {
                        padding: '10px 12px 10px 12px',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderWidth: '1.5px',
                            borderColor: '#FDE4AA',
                            pointerEvents: 'none'
                        },
                        '&:hover fieldset ': {
                            borderColor: '#FDE4AA',
                            pointerEvents: 'none'
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#FDE4AA',
                            pointerEvents: 'none'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FDE4AA',
                        }
                    },
                    "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
                        display: "none"
                    },
                    '& .MuiDataGrid-virtualScroller': {
                        ...scrollbarStyles
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#5FB4FC',
                        color: '#FAFAFA',
                        fontSize: '16px',
                        lineHeight: '16px',
                        fontFamily: 'Inter',
                        fontWeight: 600
                    },
                    '& .css-1yi8l0w-MuiButtonBase-root-MuiCheckbox-root': {
                        color: '#A82548',
                    },
                    '& .MuiDataGrid-row:nth-of-type(even)': {
                        backgroundColor: '#DBEEFF', // Color para filas pares
                    },
                    '& .MuiDataGrid-cellContent': {
                        color: '#0075D9',
                        fontSize: '16px',
                        lineHeight: '16px',
                        fontFamily: 'Inter',
                        fontWeight: 400
                    }
                }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button sx={{ width: '115px', padding: '12px, 32px, 12px, 32px', borderRadius: '25px', backgroundColor: '#A82548', height: '44px', '&:hover': { backgroundColor: '#A82548' } }} onClick={() => { handleSelectEmails() }}>
                    <Typography sx={{ color: '#FAFAFA', fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}>
                        {isLoading ? <CircularProgress sx={{ color: '#ffffff' }} size={30}/> : 'Agregar'}
                    </Typography>
                </Button>
            </Box>
        </>
    );
};
export default RolesNewEvent;
