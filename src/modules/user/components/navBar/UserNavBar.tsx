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
            <Typography variant="h6" sx={{ color: 'listItems.light', fontWeight: 600 }}>
              {userData.nameFirst} {userData.nameLast}
            </Typography>
            {userData.roles &&
              (userData.roles.superadmin ||
                userData.roles.Superadmin ||
                userData.roles.superAdmin) && (
                <Typography
                  // variant='robotoFont2'
                  sx={{ color: 'listItems.light', textAlign: 'start', fontWeight: 400 }}
                >
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
