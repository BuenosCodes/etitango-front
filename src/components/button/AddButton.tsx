import { Button, Typography } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';

export const AddButton = ({ onClick} : {onClick: () => void }) => {
    
    return (
        <>
        <Button
                sx={{
                        alignItems: 'flex-end',
                        width: {xs: '134px', md: 'auto'},
                        height: {xs: '40px', md: 'auto' },
                        borderRadius: {xs: '12px', md: 'auto' },
                        color: {xs: '#FFFFFF', md: '#A82548' },
                        backgroundColor: {xs: '#5FB4FC', md: 'transparent'},
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                onClick={onClick}>
                   <Typography sx={{ mr: {xs: 1, md: 1}, color: {  xs: '#FFFFFF', md: '#A82548'}, fontFamily: 'Roboto', fontWeight: 500 }}>
                        Agregar
                    </Typography>
                    <PersonAddAltOutlinedIcon sx={{ color: {xs: 'greyScale.50', md: 'principal.secondary'} }} />
        </Button>
        </>
    );
}