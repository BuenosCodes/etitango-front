import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ Component, isAuth, loadingComponent: LoadingComponent, ...rest }) => {
  const location = useLocation();

  if (isAuth === undefined && LoadingComponent) {
    return <LoadingComponent />;
  }

  if (!isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Component {...rest} />;
};

ProtectedRoute.propTypes = {
  Component: PropTypes.elementType.isRequired,
  isAuth: PropTypes.bool,
  loadingComponent: PropTypes.elementType,
};

export default ProtectedRoute;
