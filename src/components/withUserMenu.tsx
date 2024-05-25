import React from 'react';
import { UserMenu } from '../modules/user/components/menu/userMenu';
import UserNavBar from '../modules/user/components/navBar/UserNavBar';
import { Container } from '@mui/material';

export default function withUserMenu(Screen: React.ComponentClass<any>) {
  function WithUserMenu(props: any) {
    return (
      <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', px: 5 }}>
        <UserNavBar />
        <UserMenu />
        <Screen {...props} />
      </Container>
    );
  }
  return WithUserMenu;
}
