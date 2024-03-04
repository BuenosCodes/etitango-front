import React, { useEffect, useState } from 'react';
import { UserMenu } from '../modules/user/components/menu/userMenu2.jsx';
import UserNavBar from '../modules/user/components/navBar/UserNavBar';
import { Box, Button, Container, Theme, useMediaQuery, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SCOPES } from 'helpers/constants/i18n';
import { ROUTES } from 'App';
import { auth } from 'etiFirebase.js';
import LoginIcon from '@mui/icons-material/Login';
import { getDocument } from 'helpers/firestore/index';
import { USERS } from 'helpers/firestore/users';
import { useGlobalState } from 'helpers/UserPanelContext';

export default function withUserMenu(
  Screen: React.ComponentClass<any>,
  renderSidebar: boolean = true
) {
  const [userData, setUserData] = useState({});
  const [isSignedIn, setIsSignedIn] = useState(!!auth.currentUser); // Local signed-in state.

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser?.uid) {
        const [user] = await Promise.all([getDocument(`${USERS}/${auth.currentUser.uid}`)]);
        setUserData({ ...user });
      }
    };
    fetchData().catch((error) => console.error(error));
  }, [auth.currentUser?.uid]);

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  function WithUserMenu(props: any) {
    const navigate = useNavigate();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const { t } = useTranslation(SCOPES.COMPONENTS.BAR, { useSuspense: false });
    const logout = () => auth.signOut().then(() => navigate(ROUTES.HOME));
    const { isOpen } = useGlobalState();

    if (!renderSidebar && !isMobile) {
      return <Screen {...props} />;
    }

    return (
      <Container
        maxWidth={false}
        disableGutters={true}
        sx={{ display: 'flex', position: 'relative', minHeight: 'calc(100vh - 10.50hv - 37vh)' }}
      >
        <Box
          sx={{
            backgroundColor: 'primary.light',
            padding: '30px 0px 20px 30px',
            width: { xs: '271px', md: '255px' },
            zIndex: { xs: 1000 },
            display: { xs: !isOpen ? 'block' : 'none', md: 'block' },
            position: { xs: 'absolute', md: 'initial' },
            left: { xs: 0, md: 'initial' },
            right: { md: 0 },
            height: { xs: '100%', md: 'auto' },
            overflow: { xs: 'auto', md: 'none' }
          }}
        >
          {isMobile && <UserNavBar userData={userData} isSignedIn={isSignedIn} />}
          <UserMenu userData={userData} isSignedIn={isSignedIn} />
          {isSignedIn && (
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Button onClick={() => logout()} href={'/'} key={'signout'}>
                <LoginIcon sx={{ color: 'listItems.light' }} />
                <Typography
                  sx={{
                    ml: 1,
                    color: 'listItems.light',
                    fontWeight: 600,
                    fontFamily: 'roboto',
                    lineHeight: '22.4px'
                  }}
                >
                  {t('logout')}
                </Typography>
              </Button>
            </Box>
          )}
        </Box>
        <Screen {...props} />
      </Container>
    );
  }
  return WithUserMenu;
}
