import { IUser, UserRoles } from '../shared/User';
import { FoodChoices } from '../shared/signup';
import { Timestamp } from 'firebase/firestore';

export const mockSuperAdminUser: IUser = {
  uid: 'super-admin-id',
  email: 'superadmin@example.com',
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
    id: 'super-admin-id',
    roles: { [UserRoles.SUPER_ADMIN]: true, [UserRoles.ADMIN]: true },
    adminOf: ['event-1'],
    lastModifiedAt: Timestamp.fromDate(new Date()),
    city: 'Test City',
    country: 'Test Country',
    dniNumber: '12345678',
    email: 'superadmin@example.com',
    food: FoodChoices.OMNIVORE,
    isCeliac: false,
    nameFirst: 'Test',
    nameLast: 'User',
    province: 'Test Province',
    phoneNumber: '',
    disability: 'none',
  },
};

export const mockAdminUser: IUser = {
  ...mockSuperAdminUser,
  uid: 'admin-id',
  email: 'admin@example.com',
  data: {
    ...mockSuperAdminUser.data!,
    id: 'admin-id',
    roles: { [UserRoles.ADMIN]: true },
    email: 'admin@example.com',
  },
};

export const mockRegularUser: IUser = {
  ...mockSuperAdminUser,
  uid: 'user-id',
  email: 'user@example.com',
  data: {
    ...mockSuperAdminUser.data!,
    id: 'user-id',
    roles: { [UserRoles.ADMIN]: false },
    email: 'user@example.com',
    adminOf: [],
  },
};

export const mockUnverifiedUser: IUser = {
  ...mockRegularUser,
  emailVerified: false,
}; 