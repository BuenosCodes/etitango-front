import React from 'react';
import { UserMenu } from '../modules/user/components/menu/userMenu.jsx';
import UserNavBar from '../modules/user/components/navBar/UserNavBar';
import { Container, Grid } from '@mui/material';

export default function withUserMenu(Screen: React.ComponentClass<any>) {
  function WithUserMenu(props: any) {
    return (
      <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', px: 5 }}>
        <UserNavBar />
        <Grid container direction="row" spacing={0}>
          <Grid item xs={12} md={3}>
            <UserMenu />
          </Grid>
          <Grid item xs={12} md={9}>
            <Screen {...props} />
          </Grid>
        </Grid>
      </Container>
    );
  }
  return WithUserMenu;
}
