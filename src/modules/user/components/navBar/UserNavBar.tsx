import React from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SCOPES } from '../../../../helpers/constants/i18n';
import { styles } from './UserNavBar.styles';
import { useNavigate } from 'react-router-dom';
import { UserRoles } from 'shared/User';

export default function UserNavBar(props: { userData: any; isSignedIn: boolean }) {
  const { userData, isSignedIn } = props;
  const { t } = useTranslation(SCOPES.COMPONENTS.BAR, { useSuspense: false });
  const navigate = useNavigate();


  return (
    <Grid container sx={styles.panelContainer}>
      {isSignedIn ? (
        <Box sx={{ height: '50px' }}>
          <Stack direction="column" sx={{ height: 20, mt: '5px' }}>
            <Typography variant="h6" color= 'listItems.light' sx={{ fontWeight: 600 }}>
              {userData.nameFirst?.split(' ')[0]} {userData.nameLast?.split(' ')[0]}
            </Typography>
            {userData?.roles?.[UserRoles.SUPER_ADMIN] && (
                <Typography sx={styles.typographyRol}>
                  {t('superadmin')}
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
                backgroundColor: 'primary.main',
                color: 'listItems.light',
                width: '149px',
                height: '40px',
                borderRadius: '12px',
                align: 'center',
                margin: '3px',
                textAlign: 'center',
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
