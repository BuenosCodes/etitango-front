import React from 'react';
import { Route } from 'react-router-dom';

const ProtectedRoute = ({ Component: Component, ...rest }) => (
  <Route render={(props) => (isAuth ? <Component {...props} /> : <Redirect to="/" />)} {...rest} />
);

export default ProtectedRoute;
