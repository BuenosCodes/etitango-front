import { Auth, User } from 'firebase/auth';

// Mock user data
export const mockUserData = {
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
} as User;

// Create mock functions
export const mockUnsubscribe = jest.fn(() => {
  console.log('mockUnsubscribe called');
});

export const mockOnAuthStateChanged = jest.fn().mockImplementation((callback) => {
  console.log('mockOnAuthStateChanged called');
  callback(mockUserData);
  return mockUnsubscribe;
});

// Create mock auth instance
export const mockAuth = {
  onAuthStateChanged: mockOnAuthStateChanged,
  currentUser: mockUserData,
} as unknown as Auth;

// Export auth providers
export const GoogleAuthProvider = {
  PROVIDER_ID: 'google.com',
};

export const EmailAuthProvider = {
  EMAIL_PASSWORD_SIGN_IN_METHOD: 'password',
  PROVIDER_ID: 'password',
};

// Export individual auth functions that match the Firebase interface
export const getAuth = jest.fn(() => mockAuth);
export const signInWithEmailAndPassword = jest.fn();
export const createUserWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const sendEmailVerification = jest.fn();
export const sendPasswordResetEmail = jest.fn(); 