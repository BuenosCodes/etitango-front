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
  getStorage,
  mockUserData,
} from './firebase';
import { mockI18n } from './i18n';
import { mockRouter } from './router';

// Export all Firebase mocks
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
  getStorage,
  mockUserData,
  mockI18n,
  mockRouter,
};

// Export other mocks
export * from './users';
export * from './events';
export * from './signups';
export * from './testUtils';

// setup.tsx should be imported last since it depends on other mocks
export * from './setup'; 