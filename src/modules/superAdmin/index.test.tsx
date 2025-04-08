import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SuperAdmin from './index';
import { UserContext } from '../../helpers/UserContext';
import { UserRoles } from '../../shared/User';
import { ROUTES } from '../../App.js';
import { getEvents } from '../../helpers/firestore/events';
import { fixMailing, fixNumbering, upsertTemplates } from '../../helpers/firestore/signups';
import { mockSuperAdminUser, mockEvent, createMockEvent, createMockUser } from '../../__mocks__';
import WithAuthentication from '../withAuthentication';

// Mock the dependencies
jest.mock('../../helpers/firestore/events', () => ({
  getEvents: jest.fn(),
}));

jest.mock('../../helpers/firestore/signups', () => ({
  fixMailing: jest.fn(),
  fixNumbering: jest.fn(),
  upsertTemplates: jest.fn(),
}));

jest.mock('../withAuthentication', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="with-authentication">{children}</div>,
}));

describe('SuperAdmin', () => {
  const mockEvents = [
    createMockEvent({ id: 'event1', name: 'Event 1' }),
    createMockEvent({ id: 'event2', name: 'Event 2' }),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getEvents as jest.Mock).mockResolvedValue(mockEvents);
  });

  const renderSuperAdmin = (user = mockSuperAdminUser) => {
    return render(
      <MemoryRouter>
        <UserContext.Provider value={{ user, setUser: jest.fn() }}>
          <SuperAdmin />
        </UserContext.Provider>
      </MemoryRouter>
    );
  };

  it('should render WithAuthentication component with correct roles', () => {
    renderSuperAdmin();
    expect(screen.getByTestId('with-authentication')).toBeInTheDocument();
  });

  it('should render all navigation buttons', () => {
    renderSuperAdmin();
    expect(screen.getByText('TEMPLATES')).toBeInTheDocument();
    expect(screen.getByText('EVENTS')).toBeInTheDocument();
    expect(screen.getByText('ROLES')).toBeInTheDocument();
  });

  it('should render update templates button', () => {
    renderSuperAdmin();
    expect(screen.getByText('Actualizar email templates')).toBeInTheDocument();
  });

  it('should call upsertTemplates when update templates button is clicked', () => {
    renderSuperAdmin();
    fireEvent.click(screen.getByText('Actualizar email templates'));
    expect(upsertTemplates).toHaveBeenCalled();
  });

  it('should fetch and display events', async () => {
    renderSuperAdmin();
    await waitFor(() => {
      expect(getEvents).toHaveBeenCalled();
    });
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });

  it('should render event actions for each event', async () => {
    renderSuperAdmin();
    await waitFor(() => {
      expect(getEvents).toHaveBeenCalled();
    });

    // Get the first event container
    const event1Container = screen.getByText('Event 1').closest('div');
    expect(event1Container).toBeInTheDocument();

    // Check actions within the first event container
    expect(within(event1Container!).getByText('Fix numbers')).toBeInTheDocument();
    expect(within(event1Container!).getByText('Fix mailing')).toBeInTheDocument();
    expect(within(event1Container!).getByText('See mailing')).toBeInTheDocument();
  });

  it('should call fixNumbering when Fix numbers button is clicked', async () => {
    renderSuperAdmin();
    await waitFor(() => {
      expect(getEvents).toHaveBeenCalled();
    });

    // Get the first event container and click its Fix numbers button
    const event1Container = screen.getByText('Event 1').closest('div');
    expect(event1Container).toBeInTheDocument();
    fireEvent.click(within(event1Container!).getByText('Fix numbers'));
    expect(fixNumbering).toHaveBeenCalledWith('event1');
  });

  it('should call fixMailing when Fix mailing button is clicked', async () => {
    renderSuperAdmin();
    await waitFor(() => {
      expect(getEvents).toHaveBeenCalled();
    });

    // Get the first event container and click its Fix mailing button
    const event1Container = screen.getByText('Event 1').closest('div');
    expect(event1Container).toBeInTheDocument();
    fireEvent.click(within(event1Container!).getByText('Fix mailing'));
    expect(fixMailing).toHaveBeenCalledWith('event1');
  });

  it('should handle empty events list', async () => {
    (getEvents as jest.Mock).mockResolvedValue([]);
    renderSuperAdmin();
    await waitFor(() => {
      expect(getEvents).toHaveBeenCalled();
    });
    expect(screen.queryByText('Event 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Event 2')).not.toBeInTheDocument();
  });

  it('should handle error when fetching events', async () => {
    const error = new Error('Failed to fetch events');
    (getEvents as jest.Mock).mockRejectedValue(error);
    renderSuperAdmin();
    await waitFor(() => {
      expect(getEvents).toHaveBeenCalled();
    });
    expect(screen.queryByText('Event 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Event 2')).not.toBeInTheDocument();
  });
}); 