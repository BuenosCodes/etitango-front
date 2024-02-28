import React from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SCOPES } from '../../../../helpers/constants/i18n';
import { styles } from './UserNavBar.styles';
import { useNavigate } from 'react-router-dom';

export default function UserNavBar(props: { userData: any; isSignedIn: boolean }) {
  const { userData, isSignedIn } = props;
  const { t } = useTranslation(SCOPES.COMPONENTS.BAR, { useSuspense: false });
  const navigate = useNavigate();

  return (
    <Grid container sx={styles.panelContainer}>
      {isSignedIn ? (
        <Box sx={{ height: '50px' }}>
          <Stack direction="column" sx={{ height: 20, mt: '5px' }}>
            <Typography
              fontFamily={'Montserrat'}
              color={'#FFFFFF'}
              sx={{ fontWeight: 600, fontSize: '18px' }}
            >
              {userData.nameFirst} {userData.nameLast}
            </Typography>
            {userData.roles &&
              (userData.roles.superadmin ||
                userData.roles.Superadmin ||
                userData.roles.superAdmin) && (
                <Typography
                  fontFamily={'Roboto'}
                  color={'#FFFFFF'}
                  sx={{ textAlign: 'start', fontWeight: 400, fontSize: '14px' }}
                >
                  Superadmin
                </Typography>
              )}
          </Stack>
        </Box>
      ) : (
        <>
          <Box>
            <Button
              onClick={() => {
                navigate('/sign-in');
              }}
              key={'sign-in'}
              sx={{
                backgroundColor: '#4B84DB',
                color: '#FFFFFF',
                width: '149px',
                height: '40px',
                borderRadius: '12px',
                align: 'center',
                margin: '3px',
                textAlign: 'center',
                fontFamily: 'Montserrat',
                fontSize: '24px'
              }}
            >
              {t('signin')}
            </Button>
          </Box>
        </>
      )}
    </Grid>
  );
}
