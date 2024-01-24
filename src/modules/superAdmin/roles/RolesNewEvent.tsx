/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import WithAuthentication from '../../withAuthentication';
import { UserFullData, UserRoles, UserRolesListData } from 'shared/User';
import * as firestoreUserHelper from 'helpers/firestore/users';
import { Icon, Box, Button, Typography, Input, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const RolesNewEvent = ({ eventId, handleClose }: { eventId?: string, handleClose: Function }) => {
    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useState<UserFullData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [usuarios, setUsuarios] = useState<UserFullData[]>([]);
    // eslint-disable-next-line no-unused-vars
    const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
    const [selectedUserInfo, setSelectedUserInfo] = React.useState({});
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredUsuarios, setFilteredUsuarios] = useState<UserFullData[]>([]);

    useEffect(() => {
        setIsLoading(true);

        let unsubscribe: Function;
        let usuarios2: Function;

        const fetchData = async () => {
            unsubscribe = await firestoreUserHelper.getAdmins(setUsers, setIsLoading, eventId);
            usuarios2 = await firestoreUserHelper.getAllUsers(setUsuarios, setIsLoading)
        };
        fetchData().catch((error) => {
            console.error(error);
        });
        return () => {
            if (unsubscribe) {
                unsubscribe();
            } if (usuarios2) {
                usuarios2()
            }
        };
    }, [eventId]);

    useEffect(() => {
        const filteredData = usuarios.filter((usuario) => {
            const isSuperadmin = usuario.roles && usuario.roles.superadmin === true;

            return !isSuperadmin &&
                (
                    usuario.nameFirst.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    usuario.nameLast.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
                );
        });

        setFilteredUsuarios(filteredData);
    }, [usuarios, searchTerm]);

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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
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
            <WithAuthentication roles={[UserRoles.SUPER_ADMIN]} />
            <Box sx={{ display: 'flex', border: '1.5px solid #FDE4AA', borderRadius: '4px', padding: 1, justifyContent: 'space-between' }}>
                <Input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Buscar" disableUnderline />
                <Icon>
                    <img src='/img/icon/search_normal.svg' height={25} width={25} />
                </Icon>
            </Box>

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
                pageSize={5}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                getRowId={(row) => row.id}
                onSelectionModelChange={(selection) => {
                    const selectedInfo = selection.map((selectedId: any) => {
                        const selectedUsuario = usuarios.find((usuario) => usuario.id.toString() === selectedId);
                        return selectedUsuario ? { name: `${selectedUsuario?.nameFirst} ${selectedUsuario?.nameLast}`, email: selectedUsuario.email } : '';
                    })
                    setSelectedUserInfo(selectedInfo)
                }}
                sx={{
                    mb: 2,
                    mt: 2,
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
                        {isLoading ? <CircularProgress /> : 'Agregar'}
                    </Typography>
                </Button>
            </Box>
        </>
    );
};
export default RolesNewEvent;
