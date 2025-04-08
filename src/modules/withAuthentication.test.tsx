// Mock firebase/auth
const mockUnsubscribe = jest.fn(() => {
  console.log('mockUnsubscribe called');
});

jest.mock('firebase/auth', () => {
  const mockOnAuthStateChanged = jest.fn().mockImplementation((callback) => {
    console.log('mockOnAuthStateChanged called');
    callback({
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
      emailVerified: true,
      isAnonymous: false,
      providerId: 'password',
      tenantId: '',
      phoneNumber: '',
      metadata: {
        creationTime: '2021-01-01T00:00:00Z',
        lastSignInTime: '2021-01-01T00:00:00Z',
      },
      providerData: [],
      refreshToken: 'mock-refresh-token',
      delete: jest.fn(),
      getIdToken: jest.fn(),
      getIdTokenResult: jest.fn(),
      reload: jest.fn(),
      toJSON: jest.fn(),
    });
    return mockUnsubscribe;
  });

  const mockAuth = {
    onAuthStateChanged: mockOnAuthStateChanged,
    currentUser: null,
  };

  return {
    ...jest.requireActual('firebase/auth'),
    getAuth: jest.fn(() => mockAuth),
  };
});

// Mock getUser helper
jest.mock('../helpers/firestore/users', () => ({
  getUser: jest.fn().mockResolvedValue({
    roles: { user: true },
    adminOf: [],
  }),
}));

import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WithAuthentication from './withAuthentication';
import { UserContext } from '../helpers/UserContext';
import { UserRoles, IUser } from '../shared/User';
import { FoodChoices } from '../shared/signup';
import { Timestamp } from 'firebase/firestore';
import { Auth, User } from 'firebase/auth';
import { mockUserData } from '../__mocks__/firebase/auth';

// Create mock users with all required IUser properties
const mockAdminUser: IUser = {
  ...mockUserData,
  data: {
    id: mockUserData.uid,
    roles: { [UserRoles.ADMIN]: true },
    adminOf: ['event1'],
    lastModifiedAt: Timestamp.now(),
    country: 'Argentina',
    dniNumber: '12345678',
    email: mockUserData.email || '',
    food: FoodChoices.OMNIVORE,
    isCeliac: false,
    nameFirst: 'Test',
    nameLast: 'User',
    phoneNumber: '+1234567890',
    disability: 'none',
  },
};

const mockRegularUser: IUser = {
  ...mockUserData,
  data: {
    id: mockUserData.uid,
    roles: {},
    adminOf: [],
    lastModifiedAt: Timestamp.now(),
    country: 'Argentina',
    dniNumber: '12345678',
    email: mockUserData.email || '',
    food: FoodChoices.OMNIVORE,
    isCeliac: false,
    nameFirst: 'Test',
    nameLast: 'User',
    phoneNumber: '+1234567890',
    disability: 'none',
  },
};

const mockSuperAdminUser: IUser = {
  ...mockUserData,
  data: {
    id: mockUserData.uid,
    roles: { [UserRoles.SUPER_ADMIN]: true },
    adminOf: [],
    lastModifiedAt: Timestamp.now(),
    country: 'Argentina',
    dniNumber: '12345678',
    email: mockUserData.email || '',
    food: FoodChoices.OMNIVORE,
    isCeliac: false,
    nameFirst: 'Test',
    nameLast: 'User',
    phoneNumber: '+1234567890',
    disability: 'none',
  },
};

describe('WithAuthentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window.location.pathname
    Object.defineProperty(window, 'location', {
      value: { pathname: '/' },
      writable: true,
    });
  });

  const mockSetUser = jest.fn();

  it('should show loading state initially', () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ user: mockAdminUser, setUser: mockSetUser }}>
          <WithAuthentication>
            <div>Test Content</div>
          </WithAuthentication>
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should redirect to sign in when user is not verified', async () => {
    const unverifiedUser = { ...mockAdminUser, emailVerified: false };
    
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ user: unverifiedUser, setUser: mockSetUser }}>
          <WithAuthentication>
            <div>Test Content</div>
          </WithAuthentication>
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(window.location.pathname).toBe('/sign-in');
    });
  });

  it('should allow access when user has required role', async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ user: mockAdminUser, setUser: mockSetUser }}>
          <WithAuthentication roles={[UserRoles.ADMIN]}>
            <div>Test Content</div>
          </WithAuthentication>
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(window.location.pathname).not.toBe('/sign-in');
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  it('should allow access when user is super admin regardless of required roles', async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ user: mockSuperAdminUser, setUser: mockSetUser }}>
          <WithAuthentication roles={[UserRoles.ADMIN]}>
            <div>Test Content</div>
          </WithAuthentication>
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(window.location.pathname).not.toBe('/sign-in');
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  it('should allow access when user is admin of specific event', async () => {
    const eventId = 'test-event-id';
    const eventAdminUser = {
      ...mockAdminUser,
      data: {
        ...mockAdminUser.data!,
        adminOf: [eventId],
      },
    };

    render(
      <BrowserRouter>
        <UserContext.Provider value={{ user: eventAdminUser, setUser: mockSetUser }}>
          <WithAuthentication roles={[UserRoles.ADMIN]} eventId={eventId}>
            <div>Test Content</div>
          </WithAuthentication>
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(window.location.pathname).not.toBe('/sign-in');
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  it('should redirect when user does not have required role', async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ user: mockRegularUser, setUser: mockSetUser }}>
          <WithAuthentication roles={[UserRoles.ADMIN]}>
            <div>Test Content</div>
          </WithAuthentication>
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(window.location.pathname).toBe('/sign-in');
    });
  });

  it('should handle auth state changes', async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ user: mockAdminUser, setUser: mockSetUser }}>
          <WithAuthentication>
            <div>Test Content</div>
          </WithAuthentication>
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });
}); 