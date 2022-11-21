import React from 'react';
import { UserNavBar } from './userNavBar';
import WithAuthentication from '../withAuthentication';

export default function UserHome() {
  return (
    <>
      <WithAuthentication />
      <UserNavBar />
    </>
  );
}
