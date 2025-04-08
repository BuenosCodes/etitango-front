import React from 'react';
import { render, screen } from '@testing-library/react';
import UserHome from './index';
import { UserContext } from '../../helpers/UserContext';
import { SCOPES } from '../../helpers/constants/i18n';
import { ROUTES } from '../../App.js';

// Mock WithAuthentication component
jest.mock('../withAuthentication', () => ({
  __esModule: true,
  default: () => <div data-testid="with-authentication">WithAuthentication Component</div>,
}));

// Mock SignupStatusDisplay component
jest.mock('../components/SignupStatusDisplay', () => ({
  SignupStatusDisplay: () => <div data-testid="signup-status">SignupStatusDisplay Component</div>,
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  Translation: ({ children }) => children((key) => key),
}));

describe('UserHome', () => {
  const mockUser = {
    email: 'test@example.com',
    emailVerified: true,
    data: {
      roles: {
        user: true,
      },
    },
  };

  const renderUserHome = (user = mockUser) => {
    return render(
      <UserContext.Provider value={{ user, setUser: jest.fn() }}>
        <UserHome />
      </UserContext.Provider>
    );
  };

  it('should render WithAuthentication component', () => {
    renderUserHome();
    expect(screen.getByTestId('with-authentication')).toBeInTheDocument();
  });

  it('should render the description text', () => {
    renderUserHome();
    expect(screen.getByText('description')).toBeInTheDocument();
  });

  it('should render SignupStatusDisplay component', () => {
    renderUserHome();
    expect(screen.getByTestId('signup-status')).toBeInTheDocument();
  });

  it('should render the instructions button with correct link', () => {
    renderUserHome();
    const button = screen.getByText('Dudas? Mirá el Instructivo').closest('button');
    expect(button).toHaveAttribute('href', ROUTES.INSTRUCTIONS);
    expect(button).toHaveAttribute('variant', 'contained');
  });

  it('should render description with correct typography props', () => {
    renderUserHome();
    const description = screen.getByText('description');
    expect(description).toHaveAttribute('variant', 'h5');
    expect(description).toHaveAttribute('color', 'secondary.main');
    expect(description).toHaveStyle({
      padding: '5',
      textAlign: 'center',
    });
  });

  it('should handle unverified user state', () => {
    const unverifiedUser = { ...mockUser, emailVerified: false };
    renderUserHome(unverifiedUser);
    expect(screen.getByTestId('with-authentication')).toBeInTheDocument();
  });

  it('should handle user without data', () => {
    const userWithoutData = { ...mockUser, data: undefined };
    renderUserHome(userWithoutData);
    expect(screen.getByTestId('with-authentication')).toBeInTheDocument();
  });
}); 