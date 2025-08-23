import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignIn from './signIn';
import { auth, uiConfig } from 'etiFirebase';
import { sendVerificationEmail } from '../../helpers/firebaseAuthentication.js';
import { ROUTES } from 'App.js';

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

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue(mockAuth),
  onAuthStateChanged: jest.fn().mockReturnValue(mockUnregister),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendEmailVerification: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

// Mock Firebase Authentication
jest.mock('../../helpers/firebaseAuthentication.js', () => ({
  __esModule: true,
  default: {
    signIn: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn().mockReturnValue(mockUnregister),
    sendEmailVerification: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  },
}));

describe('SignInScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show sign in UI when user is not signed in', () => {
    const { onAuthStateChanged } = require('firebase/auth');
    onAuthStateChanged.mockImplementation((auth: any, callback: (user: any) => void) => {
      callback(null);
      return mockUnregister;
    });

    render(<SignIn />);

    expect(screen.getByText('notSignedIn')).toBeInTheDocument();
    expect(screen.getByText('Dudas? Mirá el Instructivo')).toBeInTheDocument();
  });

  it('should show email verification message when user is signed in but not verified', () => {
    const { onAuthStateChanged } = require('firebase/auth');
    onAuthStateChanged.mockImplementation((auth: any, callback: (user: any) => void) => {
      callback(mockUnverifiedUser);
      return mockUnregister;
    });

    render(<SignIn />);

    expect(screen.getByText('emailNotValidated')).toBeInTheDocument();
    expect(screen.getByText('verificationMailNotReceived')).toBeInTheDocument();
    expect(screen.getByText('checkSpamFolder')).toBeInTheDocument();
    expect(screen.getByText('RESEND')).toBeInTheDocument();
  });

  it('should redirect to user home when user is signed in and verified', () => {
    const { onAuthStateChanged } = require('firebase/auth');
    onAuthStateChanged.mockImplementation((auth: any, callback: (user: any) => void) => {
      callback(mockRegularUser);
      return mockUnregister;
    });

    render(<SignIn />);

    const navigate = screen.getByTestId('navigate');
    expect(navigate).toBeInTheDocument();
    expect(navigate.getAttribute('data-to')).toBe(ROUTES.USER_HOME);
  });

  it('should call sendVerificationEmail when resend button is clicked', async () => {
    const { onAuthStateChanged } = require('firebase/auth');
    onAuthStateChanged.mockImplementation((auth: any, callback: (user: any) => void) => {
      callback(mockUnverifiedUser);
      return mockUnregister;
    });

    render(<SignIn />);

    const resendButton = screen.getByText('RESEND');
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(sendVerificationEmail).toHaveBeenCalled();
    });
  });

  it('should clean up auth observer on unmount', () => {
    const { onAuthStateChanged } = require('firebase/auth');
    onAuthStateChanged.mockImplementation((auth: any, callback: (user: any) => void) => {
      callback(null);
      return mockUnregister;
    });

    const { unmount } = render(<SignIn />);
    unmount();

    expect(mockUnregister).toHaveBeenCalled();
  });
}); 