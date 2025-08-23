import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SuperAdmin from './index';
import { UserContext } from '../../helpers/UserContext';
import { UserRoles } from '../../shared/User';
import { ROUTES } from '../../App.js';
import { getEvents } from '../../helpers/firestore/events';
import { fixMailing, fixNumbering, upsertTemplates } from '../../helpers/firestore/signups';

// Mock WithAuthentication component
jest.mock('../withAuthentication', () => ({
  __esModule: true,
  default: () => <div data-testid="with-authentication">WithAuthentication Component</div>,
}));

// Mock Firebase functions
jest.mock('../../helpers/firestore/events', () => ({
  getEvents: jest.fn(),
}));

jest.mock('../../helpers/firestore/signups', () => ({
  fixMailing: jest.fn(),
  fixNumbering: jest.fn(),
  upsertTemplates: jest.fn(),
}));

describe('SuperAdmin', () => {
  const mockUser = {
    email: 'test@example.com',
    emailVerified: true,
    data: {
      roles: {
        [UserRoles.SUPER_ADMIN]: true,
      },
    },
  };

  const mockEvents = [
    { id: 'event1', name: 'Event 1' },
    { id: 'event2', name: 'Event 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    getEvents.mockResolvedValue(mockEvents);
  });

  const renderSuperAdmin = (user = mockUser) => {
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
    expect(screen.getByRole('button', { name: 'TEMPLATES' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'EVENTS' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ROLES' })).toBeInTheDocument();
  });

  it('should render update templates button', () => {
    renderSuperAdmin();
    expect(screen.getByRole('button', { name: 'Actualizar email templates' })).toBeInTheDocument();
  });

  it('should call upsertTemplates when update templates button is clicked', () => {
    renderSuperAdmin();
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar email templates' }));
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
    const firstEvent = screen.getByText('Event 1').closest('.MuiPaper-root');
    expect(firstEvent).toBeInTheDocument();

    // Check actions within the first event container
    within(firstEvent).getByRole('button', { name: 'Fix numbers' });
    within(firstEvent).getByRole('button', { name: 'Fix mailing' });
    within(firstEvent).getByRole('button', { name: 'See mailing' });
  });

  it('should call fixNumbering when Fix numbers button is clicked', async () => {
    renderSuperAdmin();
    await waitFor(() => {
      expect(getEvents).toHaveBeenCalled();
    });
    
    // Get the first event container and click its Fix numbers button
    const firstEvent = screen.getByText('Event 1').closest('.MuiPaper-root');
    fireEvent.click(within(firstEvent).getByRole('button', { name: 'Fix numbers' }));
    expect(fixNumbering).toHaveBeenCalledWith('event1');
  });

  it('should call fixMailing when Fix mailing button is clicked', async () => {
    renderSuperAdmin();
    await waitFor(() => {
      expect(getEvents).toHaveBeenCalled();
    });
    
    // Get the first event container and click its Fix mailing button
    const firstEvent = screen.getByText('Event 1').closest('.MuiPaper-root');
    fireEvent.click(within(firstEvent).getByRole('button', { name: 'Fix mailing' }));
    expect(fixMailing).toHaveBeenCalledWith('event1');
  });

  it('should handle empty events list', async () => {
    getEvents.mockResolvedValue([]);
    renderSuperAdmin();
    await waitFor(() => {
      expect(getEvents).toHaveBeenCalled();
    });
    expect(screen.queryByText('Event 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Event 2')).not.toBeInTheDocument();
  });

  it('should handle error when fetching events', async () => {
    const error = new Error('Failed to fetch events');
    getEvents.mockRejectedValue(error);
    renderSuperAdmin();
    await waitFor(() => {
      expect(getEvents).toHaveBeenCalled();
    });
    expect(screen.queryByText('Event 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Event 2')).not.toBeInTheDocument();
  });
}); 