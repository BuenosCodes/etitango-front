import { Button, CircularProgress, Box, Typography } from '@mui/material';
import buttonStyles from './buttonStyles';

export default function EtiButton(props: any) {
    const { isLoading, isSubmitting, title, styleKey, onClick, isOutlined=false } = props;

    const getButtonStyle = (key: any) => {
        switch (key) {
            case 'primaryButton':
                return buttonStyles.primaryButton;
            case 'smallPrimaryButton':
                return buttonStyles.smallPrimaryButton;
            case 'smallPrimaryButtonOutLine':
                return buttonStyles.smallPrimaryButtonOutLine;
            case 'mediumPrimaryButton':
                return buttonStyles.mediumPrimaryButton;
            case 'largePrimaryButton':
                return buttonStyles.largePrimaryButton;
            case 'smallSecondaryButton':
                return buttonStyles.smallSecondaryButton;
            case 'smallSecondaryDarkButton':
                return buttonStyles.smallSecondaryDarkButton;
            case 'smallSecondaryButtonOutLine':
                return buttonStyles.smallSecondaryButtonOutLine
            default:
                return {};
        }
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: {xs:'none', sm: 'center', md: 'flex-end'},
        margin: '20px',
       
    };

    return (
        <>
            <Box sx={{ ...containerStyle }}>
                <Button
                    type='submit'
                    disabled={isSubmitting}
                    variant={isOutlined ? "outlined" : "contained"}
                    onClick={onClick}
                    sx={{ ...getButtonStyle(styleKey), width: {md: '130px', sm: '50%', xs: '100%'} }} 
                >
                    {isLoading ? (
                        <CircularProgress sx={{ color: 'background.white' }} size={30} />
                    ) : (
                        <Typography typography= 'label.button' sx={{color: isOutlined ? 'principal.secondary' : 'greyScale.50', }}> {title} </Typography>
                    )}
                </Button>
            </Box>
        </>
    );
}