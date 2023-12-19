import * as React from 'react';
import { useEffect, useState } from 'react';
import { AppBar, Avatar, Box, Button, Link, Menu, Toolbar, Typography, MenuItem, Stack } from '@mui/material';
import Container from '@mui/material/Container';
import { getDocument } from 'helpers/firestore';
import { auth } from '../etiFirebase';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { PRIVATE_ROUTES, ROUTES } from '../App.js';
import { useLocation } from 'react-router-dom';
import { USERS } from 'helpers/firestore/users';


const NewAppBar = () => {
  const [isSignedIn, setIsSignedIn] = useState(!!auth.currentUser); // Local signed-in state.
  const [userData, setUserData] = useState({})
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation(SCOPES.COMPONENTS.BAR, { useSuspense: false });
  const { pathname: currentRoute } = useLocation();
  

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser?.uid) {
        const [user] = await Promise.all([
          getDocument(`${USERS}/${auth.currentUser.uid}`),
          
        ]);
        setUserData({ ...user});
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
       
          <Box>
            <Link href="/">
              <Avatar
              src="/img/icon/ETI_logo.png"
              alt="ETI"
              sx={{ width: '128px', height: '97px'}}
            />
            </Link>
          </Box>
          
          <Box
            sx={{ flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end' }}
            display={'flex'}
            id="botonera"
          >
            {isSignedIn ? (
              !PRIVATE_ROUTES.includes(currentRoute) && (
                <>  
                  <Box  sx={{ height: 70, }}>
                    <Stack direction="column" sx={{ height: 20, mt: '5px',  }}>
                      <Typography fontFamily={'Work Sans'} variant='h4b' color={'white'} sx={!userData.roles || userData.roles.admin ? {mt: 1.5} : {}}>
                        {userData.nameFirst} {userData.nameLast}
                      </Typography>
                      {userData.roles && (userData.roles.superadmin || userData.roles.Superadmin || userData.roles.superAdmin) ? (
                        <Typography fontFamily={'Work Sans'} variant='h7' color={'white'} sx={{ textAlign: 'end' }}>
                          Superadmin
                        </Typography>
                      ) : (
                        <Typography fontFamily={'Work Sans'} variant='h7' color={'white'} sx={{ textAlign: 'center' }}>
                          
                        </Typography>
                      )}
                    </Stack>
                  </Box>
        
                <Box>
                      <Button 
                      onClick={handleOpen}
                      > 
                        <img
                          src="/img/icon/settings_user.png"
                          alt="ETI"
                          sx={{ width: '48px', height: '48px' }}
                        >
                        </img>
                      </Button>
                    
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                       
                         <MenuItem onClick={handleClose}>
                         <Button
                          color="primary"
                          variant="text"
                          underline="none"
                          href={'/user/profile'}
                        >
                          PANEL GENERAL
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
              )
            ) : (
              <Button
                border={1}
                borderColor={"red"}
                color="secondary"
                variant="contained"
                underline="none"
                onClick={() => auth.signIn()}
                href={'/sign-in'}
                key={'sign-in'}
                sx={{ fontSize: 12, align: 'center', margin: '3px', textAlign: 'center' }}
              >
                {t('signin').toUpperCase()}
              </Button>
            )}
          </Box>

         
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NewAppBar;
