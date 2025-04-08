import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useParams } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Mock component to be rendered inside ProtectedRoute
const MockComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  const renderProtectedRoute = (isAuth) => {
    return render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute
                Component={MockComponent}
                isAuth={isAuth}
              />
            }
          />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should render the protected component when user is authenticated', () => {
    renderProtectedRoute(true);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Home Page')).not.toBeInTheDocument();
  });

  it('should redirect to home when user is not authenticated', () => {
    renderProtectedRoute(false);
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('should pass route params to the protected component', () => {
    const ParamComponent = () => {
      const { id } = useParams();
      return <div>Route Param: {id}</div>;
    };

    render(
      <MemoryRouter initialEntries={['/protected/123']}>
        <Routes>
          <Route
            path="/protected/:id"
            element={
              <ProtectedRoute
                Component={ParamComponent}
                isAuth={true}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Route Param: 123')).toBeInTheDocument();
  });

  it('should handle additional props', () => {
    const TestComponent = ({ extraProp }) => <div>Extra Prop: {extraProp}</div>;
    
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute
                Component={TestComponent}
                isAuth={true}
                extraProp="test value"
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Extra Prop: test value')).toBeInTheDocument();
  });

  it('should show loading state while checking authentication', () => {
    const LoadingComponent = () => <div>Loading...</div>;
    
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute
                Component={MockComponent}
                isAuth={undefined}
                loadingComponent={LoadingComponent}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
}); 