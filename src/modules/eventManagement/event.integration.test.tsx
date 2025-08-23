import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserContext } from '../../helpers/UserContext';
import { UserRoles } from '../../shared/User';
import { EtiEvent } from '../../shared/etiEvent';
import { getEvents } from '../../helpers/firestore/events';
import WithAuthentication from '../withAuthentication';
import { mockAuth, mockFirestore, mockSuperAdminUser } from '../../__mocks__';
import { Timestamp } from 'firebase/firestore';
import EventManagement from './EventManagement';
import { FoodChoices } from '../../shared/signup';

// Mock Firebase Auth
jest.mock('firebase/auth', () => mockAuth);

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  ...mockFirestore,
  Timestamp: {
    fromDate: (date: Date) => ({ toDate: () => date })
  }
}));

jest.mock('../../helpers/firestore/events', () => ({
  getEvents: jest.fn(),
}));

jest.mock('../withAuthentication', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="with-authentication">{children}</div>,
}));

describe('Event Management Integration', () => {
  const mockAdminUser = {
    ...mockSuperAdminUser,
    uid: 'admin-user-id',
    email: 'admin@example.com',
    emailVerified: true,
    data: {
      ...mockSuperAdminUser.data,
      id: 'admin-user-id',
      roles: { [UserRoles.SUPER_ADMIN]: true, [UserRoles.ADMIN]: true },
      adminOf: ['event-1'],
      lastModifiedAt: Timestamp.fromDate(new Date()),
      city: 'Test City',
      country: 'Test Country',
      dniNumber: '12345678',
      nameFirst: 'Admin',
      nameLast: 'User',
      phoneNumber: '+5491112345678',
      disability: 'none',
      email: 'admin@example.com',
      province: 'Test Province',
      food: FoodChoices.OMNIVORE,
      isCeliac: false
    }
  };

  const mockEvent = {
    id: 'event-1',
    name: 'Test Event',
    dateStart: new Date('2024-01-01'),
    dateEnd: new Date('2024-01-07'),
    dateSignupOpen: new Date('2023-12-01'),
    capacity: 100,
    location: 'Test Location'
  };

  beforeEach(() => {
    (getEvents as jest.Mock).mockResolvedValue([mockEvent]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and display events', async () => {
    render(
      <UserContext.Provider value={{ user: mockAdminUser, setUser: jest.fn() }}>
        <EventManagement />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(getEvents).toHaveBeenCalled();
    });

    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('should handle network errors', async () => {
    (getEvents as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(
      <UserContext.Provider value={{ user: mockAdminUser, setUser: jest.fn() }}>
        <EventManagement />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should update an event', async () => {
    render(
      <UserContext.Provider value={{ user: mockAdminUser, setUser: jest.fn() }}>
        <EventManagement />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(getEvents).toHaveBeenCalled();
    });

    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText('Updated Event')).toBeInTheDocument();
    });
  });
}); 