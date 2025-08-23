import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { mockRegularUser, mockUnverifiedUser } from '../__mocks__';

// Mock component for testing
const MockComponent: React.FC = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  const renderProtectedRoute = (isAuth: boolean | undefined = true) => {
    return render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute
                Component={MockComponent}
                isAuth={isAuth}
                path="/protected"
                loadingComponent={undefined}
              />
            }
          />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should render protected component when authenticated', () => {
    renderProtectedRoute(true);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect when not authenticated', () => {
    renderProtectedRoute(false);
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should pass route props to component', () => {
    const TestComponent: React.FC<{ testProp?: string }> = ({ testProp }) => (
      <div>Test Prop: {testProp}</div>
    );
    
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute
                Component={TestComponent}
                isAuth={true}
                path="/protected"
                testProp="test value"
                loadingComponent={undefined}
              />
            }
          />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Test Prop: test value')).toBeInTheDocument();
  });

  it('should handle additional route props', () => {
    const TestComponent: React.FC<{ extraProp?: string }> = ({ extraProp }) => (
      <div>Extra Prop: {extraProp}</div>
    );
    
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute
                Component={TestComponent}
                isAuth={true}
                path="/protected"
                extraProp="test value"
                loadingComponent={undefined}
              />
            }
          />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Extra Prop: test value')).toBeInTheDocument();
  });

  it('should show loading state while checking authentication', () => {
    const LoadingComponent: React.FC = () => <div>Loading...</div>;
    
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute
                Component={MockComponent}
                isAuth={undefined}
                path="/protected"
                loadingComponent={LoadingComponent}
              />
            }
          />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
}); 