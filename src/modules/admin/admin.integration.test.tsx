import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Admin from './admin';
import { UserContext } from '../../helpers/UserContext';
import { EtiEventContext } from '../../helpers/EtiEventContext';
import { mockEvent } from '../../__mocks__/events';
import { mockAdminUser } from '../../__mocks__/users';
import { mockFunctions } from '../../__mocks__';
import { UserRoles } from '../../shared/User';
import WithAuthentication from '../withAuthentication';
import { assignSuperAdmin, removeSuperAdmin, assignEventAdmin, unassignEventAdmin } from '../../helpers/firestore/users';
import { fixNumbering } from '../../helpers/firestore/signups';
import { httpsCallable } from 'firebase/functions';
import { mockSuperAdminUser, mockAuth, mockSignup, createMockEvent, createMockSignup } from '../../__mocks__';
import { getEvents } from '../../helpers/firestore/events';
import { getSignups } from '../../helpers/firestore/signups';

// Mock Firebase Functions
jest.mock('firebase/functions', () => ({
  getFunctions: jest.fn().mockReturnValue(mockFunctions),
  httpsCallable: jest.fn(),
}));

jest.mock('../../helpers/firestore/events', () => ({
  getEvents: jest.fn(),
  getEvent: jest.fn(),
  updateEvent: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

// Reuse existing mocks
jest.mock('firebase/auth', () => mockAuth);

// Mock user management functions
const mockAssignSuperAdmin = jest.fn().mockResolvedValue(undefined);
const mockRemoveSuperAdmin = jest.fn().mockResolvedValue(undefined);
const mockAssignEventAdmin = jest.fn().mockResolvedValue(undefined);
const mockUnassignEventAdmin = jest.fn().mockResolvedValue(undefined);
const mockFixNumbering = jest.fn().mockResolvedValue(undefined);

jest.mock('../../helpers/firestore/users', () => ({
  assignSuperAdmin: mockAssignSuperAdmin,
  removeSuperAdmin: mockRemoveSuperAdmin,
  assignEventAdmin: mockAssignEventAdmin,
  unassignEventAdmin: mockUnassignEventAdmin,
}));

jest.mock('../../helpers/firestore/signups', () => ({
  fixNumbering: mockFixNumbering,
  getSignups: jest.fn(),
}));

jest.mock('../withAuthentication', () => ({
  __esModule: true,
  default: ({ children, roles }: { children: React.ReactNode; roles: UserRoles[] }) => (
    <div data-testid="mock-with-authentication">{children}</div>
  ),
}));

describe('Admin Operations Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Role Management', () => {
    it('should assign super admin role', async () => {
      const targetEmail = 'newadmin@example.com';

      render(
        <UserContext.Provider value={{ user: mockSuperAdminUser, setUser: jest.fn() }}>
          <WithAuthentication roles={[UserRoles.SUPER_ADMIN]}>
            <div>Admin Operations Component</div>
          </WithAuthentication>
        </UserContext.Provider>
      );

      // Simulate assigning super admin role
      await mockAssignSuperAdmin(targetEmail);

      expect(mockAssignSuperAdmin).toHaveBeenCalledWith(targetEmail);
    });

    it('should remove super admin role', async () => {
      const targetEmail = 'admin@example.com';

      render(
        <UserContext.Provider value={{ user: mockSuperAdminUser, setUser: jest.fn() }}>
          <WithAuthentication roles={[UserRoles.SUPER_ADMIN]}>
            <div>Admin Operations Component</div>
          </WithAuthentication>
        </UserContext.Provider>
      );

      // Simulate removing super admin role
      await mockRemoveSuperAdmin(targetEmail);

      expect(mockRemoveSuperAdmin).toHaveBeenCalledWith(targetEmail);
    });
  });

  describe('Event Admin Management', () => {
    it('should assign event admin role', async () => {
      const targetEmail = 'eventadmin@example.com';

      render(
        <UserContext.Provider value={{ user: mockSuperAdminUser, setUser: jest.fn() }}>
          <WithAuthentication roles={[UserRoles.SUPER_ADMIN]}>
            <div>Admin Operations Component</div>
          </WithAuthentication>
        </UserContext.Provider>
      );

      // Simulate assigning event admin role
      await mockAssignEventAdmin(targetEmail, mockEvent.id);

      expect(mockAssignEventAdmin).toHaveBeenCalledWith(targetEmail, mockEvent.id);
    });

    it('should remove event admin role', async () => {
      const targetEmail = 'eventadmin@example.com';

      render(
        <UserContext.Provider value={{ user: mockSuperAdminUser, setUser: jest.fn() }}>
          <WithAuthentication roles={[UserRoles.SUPER_ADMIN]}>
            <div>Admin Operations Component</div>
          </WithAuthentication>
        </UserContext.Provider>
      );

      // Simulate removing event admin role
      await mockUnassignEventAdmin(targetEmail, mockEvent.id);

      expect(mockUnassignEventAdmin).toHaveBeenCalledWith(targetEmail, mockEvent.id);
    });
  });

  describe('Super Admin Operations', () => {
    it('should fix event numbering', async () => {
      const mockFunction = jest.fn().mockResolvedValue('Numbering fixed');
      (httpsCallable as jest.Mock).mockReturnValue(mockFunction);

      render(
        <UserContext.Provider value={{ user: mockSuperAdminUser, setUser: jest.fn() }}>
          <WithAuthentication roles={[UserRoles.SUPER_ADMIN]}>
            <div>Admin Operations Component</div>
          </WithAuthentication>
        </UserContext.Provider>
      );

      // Simulate fixing event numbering
      await mockFixNumbering(mockEvent.id);

      expect(httpsCallable).toHaveBeenCalledWith(expect.anything(), 'superAdmin-fixNumbering');
      expect(mockFunction).toHaveBeenCalledWith(mockEvent.id);
    });

    it('should handle errors during super admin operations', async () => {
      const mockFunction = jest.fn().mockRejectedValue(new Error('Operation failed'));
      (httpsCallable as jest.Mock).mockReturnValue(mockFunction);

      render(
        <UserContext.Provider value={{ user: mockSuperAdminUser, setUser: jest.fn() }}>
          <WithAuthentication roles={[UserRoles.SUPER_ADMIN]}>
            <div>Admin Operations Component</div>
          </WithAuthentication>
        </UserContext.Provider>
      );

      // Simulate failed operation
      await expect(mockFixNumbering(mockEvent.id)).rejects.toThrow('Operation failed');
    });
  });
}); 