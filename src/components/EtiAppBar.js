import * as React from 'react';
import { useEffect, useState,useContext } from 'react';

import { AppBar, Avatar, Box, Button, Link, Menu, Toolbar, MenuItem, Icon, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import { auth } from '../etiFirebase';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { PRIVATE_ROUTES, ROUTES } from '../App.js';
import { useLocation } from 'react-router-dom';
import { Image } from '@mui/icons-material';
import { getDocument } from 'helpers/firestore';
import { USERS, isSuperAdmin } from 'helpers/firestore/users';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import { UserContext } from 'helpers/UserContext';

const EtiAppBar = () => {
  const [isSignedIn, setIsSignedIn] = useState(!!auth.currentUser); // Local signed-in state.
  const [userData, setUserData] = useState({})
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation(SCOPES.COMPONENTS.BAR, { useSuspense: false });
  const { pathname: currentRoute } = useLocation();
  const { user } = useContext(UserContext);


  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser?.uid) {
        const [user] = await Promise.all([
          getDocument(`${USERS}/${auth.currentUser.uid}`),

        ]);
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

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const links = [
    { href: '/historia-del-eti', title: t('history') },
    { href: '/manifiesto-etiano', title: t('manifest') },
    { href: "/comision-de-genero-who", title: t("commission") } 
  ];


  return (
    <AppBar
      elevation={0}
      position="static"
      sx={{ backgroundColor: '#4B84DB', paddingX: 2 }}
      id="appbar"
    >
      <Container
        maxWidth="xl" id="container">
        <Toolbar
          disableGutters
          id="toolbar"
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >

          <Box
            sx={{
              width: '128px',
              height: '97px',
              display: {
                xs: 'none',
                sm: 'none',
                md: 'block',
                lg: 'block'
              }
            }}>
            <Link href="/">
              <img
                src="/img/logo/ETILogo.svg"
                alt="ETI"

              />
            </Link>
          </Box>

          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{
              color: 'white',
              mr: 2,
              display: {
                xs: "flex",
                sm: "flex",
                md: 'none',
                lg: 'none'
              }
            }}
          >
            <MenuIcon
              sx={{
                height: '32px',
                width: '32px'
              }} />
          </IconButton>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'space-around',
              width: '40%'
            }}
          >
            {links.map((link) => (
              <Link
                className="appBarLink"
                variant="h6"
                underline="none"
                color="#FFFFFF"
                href={link.href}
                sx={{ fontSize: 20, fontFamily: 'roboto', fontWeight: 400 }}
                key={link.href}
                display="flex"
                padding="5px"

              >
                {link.title}
              </Link>
            ))}
          </Box>
          <Box
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'flex-end',
              display: {
                xs: 'none',
                sm: 'none',
                md: 'flex',
                lg: 'flex'
              }
            }}
            id="botonera"
          >
            {isSignedIn ? (
               
                <>
                  <Box sx={{ height: 70, }}>
                    <Stack direction="column" sx={{ height: 20, mt: '5px', mr: '5px' }}>
                      <Typography fontFamily={'Work Sans'} fontSize= {'24px'} color={'white'} sx={!userData?.roles || userData?.roles?.admin ? { mt: 1.5 } : {}}>
                        {userData?.nameFirst} {userData?.nameLast}
                      </Typography>
                       {userData.roles && (userData.roles.superadmin || userData.roles.Superadmin || userData.roles.superAdmin) && (
                        <Typography fontFamily={'Work Sans'} variant='h7' color={'white'} sx={{ textAlign: 'end' }}>
                          {t('superadmin')}
                        </Typography>
                      )}
                    </Stack>
                  </Box>

                  <Box
                    sx={{ width: '48px', height: '48px' }}>
                       <IconButton
                          onClick={handleOpen}
                          fontSize='inherit'>
                          
                              <AccountCircleOutlinedIcon sx={{ height: '48px', width: '48px', color: 'white' }}></AccountCircleOutlinedIcon>
                              <Box sx={{mr: '20px'}}> 
                              <ArrowDropDownRoundedIcon sx={{ height: '35px', width: '35px', color: 'white' }}></ArrowDropDownRoundedIcon>
                            </Box>
                          {/* // <img src='/img/icon/userSettings.svg' sx={{ height: '48px', width: '48px' }}></img> */}
                      </IconButton>


                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}>

                      <MenuItem onClick={handleClose}>
                        <Button
                          color="primary"
                          variant="text"
                          underline="none"
                          href={'/user'}
                        >
                           {t('controlPanel').toUpperCase()}
                        </Button>
                      </MenuItem>

                      <MenuItem onClick={handleClose}>
                        <Button
                          color="primary"
                          variant="text"
                          underline="none"
                          onClick={() => auth.signOut()}
                          href={'/'}
                          key={'signout'}
                        >
                          {t('logout').toUpperCase()}
                        </Button>
                      </MenuItem>
                    </Menu>
                  </Box>
                </>
              
            ) : (
              <Box>
                <Button
                  onClick={() => auth.signIn()}
                  href={'/sign-in'}
                  key={'sign-in'}
                  sx={{ backgroundColor: '#5FB4FC', color: 'white', width: '149px', height: '40px', borderRadius: '12px', align: 'center', margin: '3px', textAlign: 'center', fontFamily: 'Montserrat', fontSize: '24px' }}
                >
                  {t('signin')}
                </Button>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: {
                xs: 'block',
                sm: 'block',
                md: 'none',
                lg: 'none'
              }
            }}>
            <Link href="/">
              <img src="/img/logo/ETILogo.svg" alt="ETI" style={{ width: '76px', height: '64px', }} />
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default EtiAppBar;
