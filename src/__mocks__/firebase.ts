import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { Functions } from 'firebase/functions';
import { FirebaseStorage } from 'firebase/storage';
import { Analytics } from 'firebase/analytics';
import { RemoteConfig } from 'firebase/remote-config';
import { Messaging } from 'firebase/messaging';
import { Database } from 'firebase/database';
import { User } from 'firebase/auth';
import { DocumentData, DocumentReference, DocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { StorageReference, UploadTask, UploadTaskSnapshot, FullMetadata } from 'firebase/storage';

// Mock User Data
export const mockUserData = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/photo.jpg',
};

// Create a named unsubscribe function that can be tracked
export const mockUnsubscribe = jest.fn(() => {
  console.log('mockUnsubscribe called');
});

// Mock Auth functions with proper implementation
export const mockOnAuthStateChanged = jest.fn().mockImplementation((callback) => {
  console.log('mockOnAuthStateChanged called directly');
  callback(mockUserData);
  return mockUnsubscribe;
});

// Mock Auth instance
export const mockAuth = {
  onAuthStateChanged: jest.fn().mockImplementation((callback) => {
    console.log('mockAuth.onAuthStateChanged called');
    callback(mockUserData);
    return mockUnsubscribe;
  }),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendEmailVerification: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  currentUser: mockUserData,
  GoogleAuthProvider: {
    PROVIDER_ID: 'google.com',
  },
  EmailAuthProvider: { 
    EMAIL_PASSWORD_SIGN_IN_METHOD: 'password',
    PROVIDER_ID: 'password',
  },
} as unknown as Auth;

// Export individual auth functions that match the Firebase interface
export const getAuth = jest.fn(() => {
  console.log('getAuth called');
  return mockAuth;
});

export const signInWithEmailAndPassword = jest.fn();
export const createUserWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const onAuthStateChanged = mockOnAuthStateChanged;
export const sendEmailVerification = jest.fn();
export const sendPasswordResetEmail = jest.fn();

// Mock Firestore functions
export const getDoc = jest.fn();
export const getDocs = jest.fn();
export const setDoc = jest.fn();
export const addDoc = jest.fn();
export const doc = jest.fn();
export const updateDoc = jest.fn();
export const collection = jest.fn();
export const query = jest.fn();
export const where = jest.fn();
export const orderBy = jest.fn();
export const limit = jest.fn();
export const startAfter = jest.fn();
export const endBefore = jest.fn();
export const startAt = jest.fn();
export const endAt = jest.fn();

// Mock Firestore instance
export const mockFirestore = {
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn().mockResolvedValue({
    exists: jest.fn().mockReturnValue(true),
    data: jest.fn().mockReturnValue({}),
  } as unknown as DocumentSnapshot<DocumentData>),
  getDocs: jest.fn().mockResolvedValue({
    docs: [],
    forEach: jest.fn(),
  } as unknown as QuerySnapshot<DocumentData>),
  setDoc: jest.fn().mockResolvedValue(undefined),
  updateDoc: jest.fn().mockResolvedValue(undefined),
  deleteDoc: jest.fn().mockResolvedValue(undefined),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
  endBefore: jest.fn(),
  Timestamp: {
    fromDate: (date: Date) => ({ toDate: () => date }),
    now: () => ({ toDate: () => new Date() }),
  },
} as unknown as Firestore;

// Mock Firestore error
export const mockFirestoreError = new Error('Firestore error');

// Mock Storage functions
export const getStorage = jest.fn();
export const ref = jest.fn();
export const uploadBytesResumable = jest.fn();
export const getDownloadURL = jest.fn();

// Mock Storage instance
const mockMetadata: FullMetadata = {
  bucket: 'test-bucket',
  fullPath: 'test/path',
  generation: 'test-generation',
  metageneration: 'test-metageneration',
  name: 'test-file',
  size: 100,
  timeCreated: new Date().toISOString(),
  updated: new Date().toISOString(),
  md5Hash: 'test-hash',
  contentType: 'application/pdf',
  contentEncoding: 'utf-8',
  contentDisposition: 'inline',
  contentLanguage: 'en',
  customMetadata: {},
  downloadTokens: ['test-token'],
};

export const mockUploadTask: Partial<UploadTask> = {
  on: jest.fn(),
  snapshot: {
    ref: {
      bucket: 'test-bucket',
      fullPath: 'test/path',
      name: 'test-file',
      root: {} as StorageReference,
      storage: {} as FirebaseStorage,
      parent: {} as StorageReference,
    },
    metadata: mockMetadata,
    bytesTransferred: 50,
    totalBytes: 100,
    state: 'running',
    task: {} as UploadTask,
  },
};

export const mockStorage = {
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytesResumable: jest.fn().mockReturnValue(mockUploadTask),
  getDownloadURL: jest.fn().mockResolvedValue('https://example.com/test.jpg'),
} as unknown as FirebaseStorage;

// Mock Functions instance
export const mockFunctions = {
  getFunctions: jest.fn(),
  httpsCallable: jest.fn(),
} as unknown as Functions;

// Mock Analytics instance
export const mockAnalytics = {
  getAnalytics: jest.fn(),
  logEvent: jest.fn(),
} as unknown as Analytics;

// Mock Performance instance
export const mockPerformance = {
  getPerformance: jest.fn(),
  trace: jest.fn(),
} as unknown as Performance;

// Mock Remote Config instance
export const mockRemoteConfig = {
  getRemoteConfig: jest.fn(),
  getValue: jest.fn(),
} as unknown as RemoteConfig;

// Mock Messaging instance
export const mockMessaging = {
  getMessaging: jest.fn(),
  getToken: jest.fn(),
} as unknown as Messaging;

// Mock Database instance
export const mockDatabase = {
  getDatabase: jest.fn(),
  ref: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
} as unknown as Database;

// Export all mocks as default
export default {
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
}; 