import React from 'react';
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
            default:
                return {};
        }
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'flex-end',
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
                    sx={{ ...getButtonStyle(styleKey) }} 
                >
                    {isLoading ? (
                        <CircularProgress sx={{ color: 'background.white' }} size={30} />
                    ) : (
                        <Typography
                            sx={{
                                color: isOutlined ? 'principal.secondary' : 'greyScale.50',
                                fontWeight: 500,
                                fontSize: '14px',
                                lineHeight: '20px',
                            }}
                        >
                            {title}
                        </Typography>
                    )}
                </Button>
            </Box>
        </>
    );
}