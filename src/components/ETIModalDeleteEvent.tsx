import { Box, Modal, Typography, Button } from "@mui/material";

const ETIModalDeleteEvent = ({handleCloseModal, open, handleDeleteButton} : {handleCloseModal : Function, open : boolean, handleDeleteButton: Function}) => {

const styleModal = {
        position: 'absolute' as 'absolute',
        top: '22.5%',
        left: '46%',
        // transform: 'translate(-50%, -50%)',
        bgcolor: '#F5F5F5',
        border: '1px solid #000',
        boxShadow: 24,
        borderRadius: 3,
        p: 3,
        overflow: 'none',
        width: '422px',
        height: '209px',     
 };

return (
    <Box sx={{...styleModal}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
             <Box sx={{ mb: 2}}>
                <Typography variant="h6">¿Eliminar elementos seleccionados?</Typography>
            </Box>

            <Box sx={{borderBottom: '1px solid #E0E0E0', width: '100%'}}>

            </Box>

            <Box sx={{ mt: 2}}>
            <Typography sx={{fontFamily: 'roboto'}}>Los ETI seleccionados serán eliminados</Typography>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', width: '65%'}}>
                <Box >
                <Button sx={{color: '#A82548', border: '1px solid #9E9E9E', height: '44px', width: '104px', borderRadius: '25px', gap: '8px', marginLeft: 'auto', fontFamily: 'roboto', fontSize: '14px'}} onClick={() => handleCloseModal()}>Cancelar</Button>
                </Box>

                <Box sx={{justifyContent: 'center'}}>
                <Button sx={{color: 'white', background: '#A82548', height: '44px', width: '104px', borderRadius: '25px', gap: '8px', marginLeft: 'auto', fontFamily: 'roboto', fontSize: '14px'}} onClick={() => handleDeleteButton()}>Borrar</Button>
                </Box>
            </Box>

        </Box>
    </Box>
)
}

export default ETIModalDeleteEvent;
