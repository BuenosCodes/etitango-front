/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { ROUTES } from '../../../../App';
import { auth } from '../../../../etiFirebase';
import { useTranslation } from 'react-i18next';
import { SCOPES } from '../../../../helpers/constants/i18n';
import { styles } from './UserNavBar.styles';
import { IUser } from '../../../../shared/User';
import { UserContext } from '../../../../helpers/UserContext';
import { useNavigate } from 'react-router-dom';

export default function UserNavBar(props: { userData: any; isSignedIn: boolean }) {
  const {userData, isSignedIn} = props;
  const { t } = useTranslation(SCOPES.COMPONENTS.BAR, { useSuspense: false });
  const { user }: { user: IUser } = useContext(UserContext);
  const navigate = useNavigate();
  const logout = () => auth.signOut().then(() => navigate(ROUTES.HOME));

  return (
    <Grid container sx={styles.panelContainer}>

        <Box sx={{ height: '50px', display: { xs: 'block', lg: 'none' } }}>
              <Stack direction="column" sx={{ height: 20, mt: '5px', }}>
                <Typography fontFamily={'Montserrat'} color={'white'} sx={{ fontWeight: 600, fontSize: '18px' }}>
                  {userData.nameFirst} {userData.nameLast}
                </Typography>
                {userData.roles && (userData.roles.superadmin || userData.roles.Superadmin || userData.roles.superAdmin) &&
                  <Typography fontFamily={'Roboto'} color={'white'} sx={{ textAlign: 'start', fontWeight: 400, fontSize: '14px' }}>
                    Superadmin
                  </Typography>}
              </Stack>
            </Box>

      {/* <Grid item xs={12} md={3} sx={styles.accountInfoContainer}>
        <AccountCircle sx={styles.accountIcon} />
        <Box sx={styles.accountInfo}>
          <Typography variant={'h6'} noWrap>
            {user.data?.nameFirst}
          </Typography>
          <Typography variant={'h6'} noWrap>
            {user.email}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={7} sx={styles.panelTitleContainer}>
        <Button sx={styles.panelTitle} href={ROUTES.USER_HOME} key={'profile'}>
          {t('controlPanel')}
        </Button>
      </Grid>
      <Grid item xs={12} md sx={styles.panelTitleContainer}>
        <Button color={'secondary'} variant={'contained'} onClick={() => logout()} key={'signout'}>
          {t('logout').toUpperCase()}
        </Button>
      </Grid> */}
    </Grid>
  );
}