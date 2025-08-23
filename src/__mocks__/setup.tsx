import {
  mockFirestore,
  mockAuth,
  mockFunctions,
  mockStorage,
  mockAnalytics,
  mockPerformance,
  mockRemoteConfig,
  mockMessaging,
  mockDatabase,
  mockUserData,
  getStorage,
} from './firebase';
import { mockI18n } from './i18n';
import { mockRouter } from './router';

// Mock Firebase App
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApp: jest.fn(),
  getApps: jest.fn(),
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  ...mockAuth,
  getAuth: jest.fn().mockReturnValue(mockAuth),
  onAuthStateChanged: jest.fn().mockReturnValue(() => {}),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendEmailVerification: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  ...mockFirestore,
  getFirestore: jest.fn().mockReturnValue(mockFirestore),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
}));

// Mock Firebase Functions
jest.mock('firebase/functions', () => ({
  ...mockFunctions,
  getFunctions: jest.fn().mockReturnValue(mockFunctions),
  httpsCallable: jest.fn(),
}));

// Mock Firebase Storage
jest.mock('firebase/storage', () => ({
  ...mockStorage,
  getStorage: jest.fn().mockReturnValue(mockStorage),
  ref: jest.fn(),
  uploadBytesResumable: jest.fn(),
  getDownloadURL: jest.fn(),
}));

// Mock Firebase Analytics
jest.mock('firebase/analytics', () => ({
  ...mockAnalytics,
  getAnalytics: jest.fn().mockReturnValue(mockAnalytics),
  logEvent: jest.fn(),
}));

// Mock Firebase Performance
jest.mock('firebase/performance', () => ({
  ...mockPerformance,
  getPerformance: jest.fn().mockReturnValue(mockPerformance),
}));

// Mock Firebase Remote Config
jest.mock('firebase/remote-config', () => ({
  ...mockRemoteConfig,
  getRemoteConfig: jest.fn().mockReturnValue(mockRemoteConfig),
}));

// Mock Firebase Messaging
jest.mock('firebase/messaging', () => ({
  ...mockMessaging,
  getMessaging: jest.fn().mockReturnValue(mockMessaging),
}));

// Mock Firebase Realtime Database
jest.mock('firebase/database', () => ({
  ...mockDatabase,
  getDatabase: jest.fn().mockReturnValue(mockDatabase),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  ...mockI18n,
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...mockRouter,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

// Mock Firebase Authentication Helper
jest.mock('../helpers/firebaseAuthentication', () => ({
  __esModule: true,
  default: {
    signIn: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
    sendEmailVerification: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  },
}));

// Mock Firebase Firestore Helpers
jest.mock('../helpers/firestore/events', () => ({
  getEvents: jest.fn(),
  getEvent: jest.fn(),
  createEvent: jest.fn(),
  updateEvent: jest.fn(),
  deleteEvent: jest.fn(),
}));

jest.mock('../helpers/firestore/users', () => ({
  getUser: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

jest.mock('../helpers/firestore/signups', () => ({
  getSignup: jest.fn(),
  createSignup: jest.fn(),
  updateSignup: jest.fn(),
  deleteSignup: jest.fn(),
  fixMailing: jest.fn(),
  fixNumbering: jest.fn(),
  upsertTemplates: jest.fn(),
}));

// Mock Firebase Functions Helper
jest.mock('../helpers/functions', () => ({
  sendEmail: jest.fn(),
  sendSMS: jest.fn(),
  generateReceipt: jest.fn(),
}));

// Export all mocks for use in tests
export {
  mockFirestore,
  mockAuth,
  mockFunctions,
  mockStorage,
  mockAnalytics,
  mockPerformance,
  mockRemoteConfig,
  mockMessaging,
  mockDatabase,
  mockUserData,
  mockI18n,
  mockRouter,
}; 