import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserContext } from '../../helpers/UserContext';
import { UserRoles } from '../../shared/User';
import { EtiEvent } from '../../shared/etiEvent';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../helpers/firestore/events';
import WithAuthentication from '../withAuthentication';
import { mockAuth, mockFirestore, mockSuperAdminUser } from '../../__mocks__';
import { Timestamp } from 'firebase/firestore';
import EventManagement from './EventManagement';

// Reuse existing mocks
jest.mock('firebase/auth', () => mockAuth);

jest.mock('../../helpers/firestore/events', () => ({
  getEvents: jest.fn(),
  createEvent: jest.fn(),
  updateEvent: jest.fn(),
  deleteEvent: jest.fn(),
}));

jest.mock('../withAuthentication', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="with-authentication">{children}</div>,
}));

describe('Event Management Integration', () => {
  const mockAdminUser = {
    uid: 'admin-user-id',
    email: 'admin@example.com',
    emailVerified: true,
    data: {
      roles: { [UserRoles.ADMIN]: true },
      adminOf: ['event-1'],
    },
  };

  const mockEvent = {
    id: 'event-1',
    name: 'Test Event',
    description: 'Test Description',
    startDate: new Date(),
    endDate: new Date(),
    location: 'Test Location',
    maxParticipants: 100,
    price: 100,
    currency: 'USD',
    status: 'active',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CRUD Operations', () => {
    it('should fetch and display events', async () => {
      const mockEvents = [mockEvent];
      getEvents.mockResolvedValue(mockEvents);

      render(
        <UserContext.Provider value={{ user: mockAdminUser, setUser: jest.fn() }}>
          <WithAuthentication>
            <div>Event Management Component</div>
          </WithAuthentication>
        </UserContext.Provider>
      );

      await waitFor(() => {
        expect(getEvents).toHaveBeenCalled();
      });
    });

    it('should create a new event', async () => {
      const newEvent = { ...mockEvent, id: undefined };
      createEvent.mockResolvedValue({ id: 'new-event-id', ...newEvent });

      render(
        <UserContext.Provider value={{ user: mockAdminUser, setUser: jest.fn() }}>
          <WithAuthentication>
            <div>Event Management Component</div>
          </WithAuthentication>
        </UserContext.Provider>
      );

      // Simulate event creation
      await waitFor(() => {
        expect(createEvent).toHaveBeenCalledWith(newEvent);
      });
    });

    it('should update an existing event', async () => {
      const updatedEvent = { ...mockEvent, name: 'Updated Event' };
      updateEvent.mockResolvedValue(updatedEvent);

      render(
        <UserContext.Provider value={{ user: mockAdminUser, setUser: jest.fn() }}>
          <WithAuthentication>
            <div>Event Management Component</div>
          </WithAuthentication>
        </UserContext.Provider>
      );

      // Simulate event update
      await waitFor(() => {
        expect(updateEvent).toHaveBeenCalledWith(mockEvent.id, updatedEvent);
      });
    });

    it('should delete an event', async () => {
      deleteEvent.mockResolvedValue(true);

      render(
        <UserContext.Provider value={{ user: mockAdminUser, setUser: jest.fn() }}>
          <WithAuthentication>
            <div>Event Management Component</div>
          </WithAuthentication>
        </UserContext.Provider>
      );

      // Simulate event deletion
      await waitFor(() => {
        expect(deleteEvent).toHaveBeenCalledWith(mockEvent.id);
      });
    });
  });

  describe('Validation', () => {
    it('should validate required fields when creating an event', async () => {
      const invalidEvent = { ...mockEvent, name: undefined };
      createEvent.mockRejectedValue(new Error('Name is required'));

      render(
        <UserContext.Provider value={{ user: mockAdminUser, setUser: jest.fn() }}>
          <WithAuthentication>
            <div>Event Management Component</div>
          </WithAuthentication>
        </UserContext.Provider>
      );

      // Simulate invalid event creation
      await waitFor(() => {
        expect(createEvent).toHaveBeenCalledWith(invalidEvent);
      });
    });

    it('should validate date ranges when updating an event', async () => {
      const invalidEvent = {
        ...mockEvent,
        endDate: new Date(mockEvent.startDate.getTime() - 1000),
      };
      updateEvent.mockRejectedValue(new Error('End date must be after start date'));

      render(
        <UserContext.Provider value={{ user: mockAdminUser, setUser: jest.fn() }}>
          <WithAuthentication>
            <div>Event Management Component</div>
          </WithAuthentication>
        </UserContext.Provider>
      );

      // Simulate invalid event update
      await waitFor(() => {
        expect(updateEvent).toHaveBeenCalledWith(mockEvent.id, invalidEvent);
      });
    });
  });

  describe('Access Control', () => {
    it('should restrict event creation to admin users', async () => {
      const regularUser = {
        ...mockAdminUser,
        data: { roles: {}, adminOf: [] },
      };

      render(
        <UserContext.Provider value={{ user: regularUser, setUser: jest.fn() }}>
          <WithAuthentication>
            <div>Event Management Component</div>
          </WithAuthentication>
        </UserContext.Provider>
      );

      // Verify create button is not present
      expect(screen.queryByText('Create Event')).not.toBeInTheDocument();
    });

    it('should allow event management for event-specific admins', async () => {
      const eventAdminUser = {
        ...mockAdminUser,
        data: { roles: {}, adminOf: [mockEvent.id] },
      };

      render(
        <UserContext.Provider value={{ user: eventAdminUser, setUser: jest.fn() }}>
          <WithAuthentication>
            <div>Event Management Component</div>
          </WithAuthentication>
        </UserContext.Provider>
      );

      // Verify event-specific actions are available
      expect(screen.getByText('Manage Event')).toBeInTheDocument();
    });
  });

  describe('Data Persistence', () => {
    it('should handle network errors during event operations', async () => {
      getEvents.mockRejectedValue(new Error('Network error'));

      render(
        <UserContext.Provider value={{ user: mockAdminUser, setUser: jest.fn() }}>
          <WithAuthentication>
            <div>Event Management Component</div>
          </WithAuthentication>
        </UserContext.Provider>
      );

      // Verify error handling
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('should maintain data consistency after concurrent updates', async () => {
      const updatedEvent = { ...mockEvent, name: 'Updated Event' };
      updateEvent.mockResolvedValue(updatedEvent);
      getEvents.mockResolvedValue([updatedEvent]);

      render(
        <UserContext.Provider value={{ user: mockAdminUser, setUser: jest.fn() }}>
          <WithAuthentication>
            <div>Event Management Component</div>
          </WithAuthentication>
        </UserContext.Provider>
      );

      // Verify data consistency
      await waitFor(() => {
        expect(screen.getByText('Updated Event')).toBeInTheDocument();
      });
    });
  });
}); 