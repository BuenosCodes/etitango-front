import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from './signIn';
import { auth, uiConfig } from 'etiFirebase';
import { sendVerificationEmail } from '../../helpers/firebaseAuthentication.js';
import { ROUTES } from 'App.js';
import { mockRegularUser, mockUnverifiedUser, mockUnregister, mockAuth } from '../../__mocks__';

// Mock Firebase Auth
jest.mock('firebase/auth', () => mockAuth);

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
}));

// Mock Firebase Authentication
jest.mock('../../helpers/firebaseAuthentication.js', () => ({
  sendVerificationEmail: jest.fn(),
}));

// Mock i18next
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('SignInScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show sign in UI when user is not signed in', () => {
    const { onAuthStateChanged } = require('firebase/auth');
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return mockUnregister;
    });

    render(<SignIn />);

    expect(screen.getByText('notSignedIn')).toBeInTheDocument();
    expect(screen.getByText('Dudas? Mirá el Instructivo')).toBeInTheDocument();
  });

  it('should show email verification message when user is signed in but not verified', () => {
    const { onAuthStateChanged } = require('firebase/auth');
    onAuthStateChanged.mockImplementation((auth, callback) => {
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
    onAuthStateChanged.mockImplementation((auth, callback) => {
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
    onAuthStateChanged.mockImplementation((auth, callback) => {
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
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return mockUnregister;
    });

    const { unmount } = render(<SignIn />);
    unmount();

    expect(mockUnregister).toHaveBeenCalled();
  });
}); 