import { IUser } from '../shared/User';
import { EtiEvent } from '../shared/etiEvent';
import { Signup, SignupStatus, FoodChoices, SignupHelpWith } from '../shared/signup';
import { Timestamp } from 'firebase/firestore';

// Mock functions
export const mockSetUser = jest.fn();
export const mockSetEtiEvent = jest.fn();
export const mockNavigate = jest.fn();
export const mockUnregister = jest.fn();
export const mockOnAuthStateChanged = jest.fn();

// Mock file data
export const mockFileData = {
  name: 'test.jpg',
  type: 'image/jpeg',
  size: 1024,
  url: 'https://example.com/test.jpg',
};

// Mock function responses
export const mockSuccessResponse = {
  success: true,
  data: {},
};

export const mockErrorResponse = {
  success: false,
  error: {
    code: 'test-error',
    message: 'Test error message',
  },
};

// Mock error data
export const mockErrorData = {
  version: '1.0',
  timestamp: new Date().toISOString(),
  error: {
    code: 'test-error',
    message: 'Test error message',
  },
};

// Helper functions to create variations of mock data
export const createMockUser = (overrides: Partial<IUser> = {}): IUser => ({
  uid: 'test-uid',
  email: 'test@example.com',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: jest.fn(),
  getIdToken: jest.fn(),
  getIdTokenResult: jest.fn(),
  reload: jest.fn(),
  toJSON: jest.fn(),
  displayName: null,
  phoneNumber: null,
  photoURL: null,
  providerId: 'password',
  data: {
    id: 'test-uid',
    roles: {},
    adminOf: [],
    lastModifiedAt: Timestamp.fromDate(new Date()),
    city: 'Test City',
    country: 'Test Country',
    dniNumber: '12345678',
    email: 'test@example.com',
    food: FoodChoices.OMNIVORE,
    isCeliac: false,
    nameFirst: 'Test',
    nameLast: 'User',
    province: 'Test Province',
    phoneNumber: '+5491112345678',
    disability: 'none',
    ...overrides.data
  },
  ...overrides
});

export const createMockEvent = (overrides: Partial<EtiEvent> = {}): EtiEvent => ({
  id: 'test-event-id',
  image: 'test-image.jpg',
  name: 'Test Event',
  location: 'Test Location',
  admins: ['test-admin-id'],
  capacity: 100,
  daysBeforeExpiration: 30,
  bank: {
    entity: 'Test Bank',
    holder: 'Test Holder',
    cbu: '123456789',
    alias: 'test.alias',
    cuit: '12345678901',
  },
  schedule: [{ title: 'Day 1', activities: 'Test Activities' }],
  locations: [{ name: 'Test Location', link: 'https://test.com' }],
  landingTitle: 'Test Landing Title',
  comboReturnDeadlineHuman: '30 days',
  lodgingCapacity: 50,
  dateStart: new Date(),
  dateEnd: new Date(),
  dateSignupOpen: new Date(),
  comboReturnDeadline: new Date(),
  prices: [
    {
      deadlineHuman: '30 days',
      deadline: new Date(),
      price: 100,
    },
  ],
  ...overrides,
});

export const createMockSignup = (overrides: Partial<Signup> = {}): Signup => ({
  id: 'test-signup-id',
  etiEventId: 'test-event-id',
  status: SignupStatus.PAYMENT_PENDING,
  didAttend: false,
  orderNumber: 1,
  lastModifiedAt: new Date(),
  statusHistory: [
    { status: SignupStatus.PAYMENT_PENDING, date: new Date() }
  ],
  userId: 'test-uid',
  dateArrival: new Date(),
  dateDeparture: new Date(),
  helpWith: SignupHelpWith.CLEANING,
  food: FoodChoices.OMNIVORE,
  isCeliac: false,
  country: 'Test Country',
  province: 'Test Province',
  city: 'Test City',
  wantsLodging: true,
  dniNumber: '12345678',
  email: 'test@example.com',
  nameFirst: 'Test',
  nameLast: 'User',
  phoneNumber: '+5491112345678',
  disability: 'none',
  adminOf: [],
  roles: { admin: false },
  ...overrides,
}); 