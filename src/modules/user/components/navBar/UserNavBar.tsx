import React from 'react';
import { Box, Button, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SCOPES } from '../../../../helpers/constants/i18n';
import { styles } from './UserNavBar.styles';
import { useNavigate } from 'react-router-dom';
import { UserRoles } from 'shared/User';
import { ROUTES } from 'App';
import { fullName } from 'helpers/firestore/users';

export default function UserNavBar(props: { userData: any; isSignedIn: boolean }) {
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  const { userData, isSignedIn } = props;
  const { t } = useTranslation(SCOPES.COMPONENTS.BAR, { useSuspense: false });
  const navigate = useNavigate();
  const name = fullName(userData);
  const isSuperAdmin = userData?.roles?.[UserRoles.SUPER_ADMIN];

  return (
    <Grid container sx={styles.panelContainer}>
      {isSignedIn ? (
        <Box sx={{ height: '60px' }}>
          <Stack direction="column" sx={{ height: 20, mt: '5px' }}>
            <Typography variant="h6" color="greyScale.50" sx={{ fontWeight: 600 }}>
              {name}
            </Typography>
            {isSuperAdmin && (
              <Typography
                typography={'body.regular.m'}
                sx={{ color: 'greyScale.50', textAlign: 'start' }}
              >
                {t('superadmin')}
              </Typography>
            )}
          </Stack>
        </Box>
      ) : (
        <>
          <Box sx={{ height: '60px' }}>
            <Button
              onClick={() => {
                navigate(ROUTES.SIGN_IN);
              }}
              key={'sign-in'}
              sx={{
                backgroundColor: 'details.azure',
                color: 'greyScale.50',
                width: '149px',
                height: '40px',
                borderRadius: '12px',
                align: 'center',
                margin: '0px',
                textAlign: 'center',
                fontSize: '24px'
              }}
            >
              {t('signin')}
            </Button>
          </Box>
        </>
      )}
      <Grid item xs={12}>
        {isMobile && (
          <Box sx={{ border: '1px solid', mt: 1.5, mb: 1.5, borderColor: 'greyScale.50' }} />
        )}
      </Grid>
    </Grid>
  );
}
