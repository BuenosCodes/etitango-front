import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  Component: React.ComponentType<any>;
  isAuth?: boolean;
  loadingComponent?: React.ComponentType;
  path?: string;
  [key: string]: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  Component, 
  isAuth, 
  loadingComponent: LoadingComponent,
  path,
  ...rest 
}) => {
  const location = useLocation();

  if (isAuth === undefined && LoadingComponent) {
    return <LoadingComponent />;
  }

  if (!isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute; 