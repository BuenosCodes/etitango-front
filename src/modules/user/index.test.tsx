import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserHome from './index';
import { UserContext } from '../../helpers/UserContext';
import { SCOPES } from '../../helpers/constants/i18n';
import { ROUTES } from '../../App.js';
import { mockRegularUser, createMockUser } from '../../__mocks__';
import { mockI18n } from '../../__mocks__';
import { I18nextProvider } from 'react-i18next';

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
jest.mock('react-i18next', () => mockI18n);

describe('UserHome', () => {
  const renderUserHome = (user = mockRegularUser) => {
    return render(
      <I18nextProvider i18n={mockI18n.i18n}>
        <MemoryRouter>
          <UserContext.Provider value={{ user, setUser: jest.fn() }}>
            <UserHome />
          </UserContext.Provider>
        </MemoryRouter>
      </I18nextProvider>
    );
  };

  it('should render WithAuthentication component', () => {
    renderUserHome();
    expect(screen.getByTestId('with-authentication')).toBeInTheDocument();
  });

  it('should render the description text', () => {
    renderUserHome();
    const description = screen.getByText('description');
    expect(description).toBeInTheDocument();
    expect(description.tagName).toBe('P'); // Typography renders as p
    expect(description).toHaveStyle({
      padding: '5',
      textAlign: 'center',
    });
  });

  it('should render SignupStatusDisplay component', () => {
    renderUserHome();
    expect(screen.getByTestId('signup-status')).toBeInTheDocument();
  });

  it('should render the instructions button with correct link', () => {
    renderUserHome();
    const button = screen.getByRole('button', { name: 'Dudas? Mirá el Instructivo' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', ROUTES.INSTRUCTIONS);
    expect(button).toHaveClass('MuiButton-contained');
  });

  it('should handle unverified user state', () => {
    const unverifiedUser = createMockUser({ emailVerified: false });
    renderUserHome(unverifiedUser);
    expect(screen.getByTestId('with-authentication')).toBeInTheDocument();
  });

  it('should handle user without data', () => {
    const userWithoutData = createMockUser({ data: undefined });
    renderUserHome(userWithoutData);
    expect(screen.getByTestId('with-authentication')).toBeInTheDocument();
  });
}); 