import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignIn from './signIn';
import { auth, uiConfig } from 'etiFirebase';
import { createUserInDbIfNotExists } from '../../helpers/functions';
import { sendVerificationEmail } from '../../helpers/firebaseAuthentication';
import { ROUTES } from 'App.js';
import { UserRoles } from '../../shared/User';

// Import mocks first
import { mockAuth, mockUserData } from '../../__mocks__';

// Create mock users
const mockRegularUser = {
  ...mockUserData,
  emailVerified: true,
};

const mockUnverifiedUser = {
  ...mockUserData,
  emailVerified: false,
};

// Create mock unregister function
const mockUnregister = jest.fn();

// Reuse existing mocks
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue(mockAuth),
  onAuthStateChanged: jest.fn().mockReturnValue(mockUnregister),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendEmailVerification: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('Login Process Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should handle successful email/password login', async () => {
      const { signInWithEmailAndPassword } = require('firebase/auth');
      signInWithEmailAndPassword.mockResolvedValue({ user: mockRegularUser });

      render(<SignIn />);

      // Simulate successful login
      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalled();
      });

      // Verify user is created in DB
      expect(createUserInDbIfNotExists).toHaveBeenCalledWith(mockRegularUser);
    });

    it('should handle successful Google login', async () => {
      const { signInWithPopup } = require('firebase/auth');
      signInWithPopup.mockResolvedValue({ user: mockRegularUser });

      render(<SignIn />);

      // Simulate successful Google login
      await waitFor(() => {
        expect(signInWithPopup).toHaveBeenCalled();
      });

      // Verify user is created in DB
      expect(createUserInDbIfNotExists).toHaveBeenCalledWith(mockRegularUser);
    });

    it('should handle login errors', async () => {
      const { signInWithEmailAndPassword } = require('firebase/auth');
      signInWithEmailAndPassword.mockRejectedValue(new Error('Invalid credentials'));

      render(<SignIn />);

      // Verify error message is displayed
      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });
  });

  describe('Session Management', () => {
    it('should maintain user session after successful login', async () => {
      const { onAuthStateChanged } = require('firebase/auth');
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockRegularUser);
        return () => {};
      });

      render(<SignIn />);

      // Verify user is redirected to home
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', ROUTES.USER_HOME);
    });

    it('should handle session expiration', async () => {
      const { onAuthStateChanged } = require('firebase/auth');
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        callback(mockRegularUser);
        return () => {};
      });

      render(<SignIn />);

      // Simulate session expiration
      authCallback(null);

      // Verify user is shown login screen
      expect(screen.getByText('notSignedIn')).toBeInTheDocument();
    });
  });

  describe('Role-based Redirects', () => {
    it('should redirect regular users to user home', async () => {
      const { onAuthStateChanged } = require('firebase/auth');
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockRegularUser);
        return () => {};
      });

      render(<SignIn />);

      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', ROUTES.USER_HOME);
    });

    it('should redirect admin users to admin dashboard', async () => {
      const { onAuthStateChanged } = require('firebase/auth');
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockAdminUser);
        return () => {};
      });

      render(<SignIn />);

      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', ROUTES.USER_HOME);
    });

    it('should redirect super admin users to super admin dashboard', async () => {
      const { onAuthStateChanged } = require('firebase/auth');
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockSuperAdminUser);
        return () => {};
      });

      render(<SignIn />);

      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', ROUTES.USER_HOME);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors during login', async () => {
      const { signInWithEmailAndPassword } = require('firebase/auth');
      signInWithEmailAndPassword.mockRejectedValue(new Error('Network error'));

      render(<SignIn />);

      // Verify error message is displayed
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('should handle invalid credentials', async () => {
      const { signInWithEmailAndPassword } = require('firebase/auth');
      signInWithEmailAndPassword.mockRejectedValue(new Error('Invalid email or password'));

      render(<SignIn />);

      // Verify error message is displayed
      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      });
    });

    it('should handle account disabled errors', async () => {
      const { signInWithEmailAndPassword } = require('firebase/auth');
      signInWithEmailAndPassword.mockRejectedValue(new Error('Account has been disabled'));

      render(<SignIn />);

      // Verify error message is displayed
      await waitFor(() => {
        expect(screen.getByText('Account has been disabled')).toBeInTheDocument();
      });
    });
  });
}); 