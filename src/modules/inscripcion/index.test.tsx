import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Index from './index';
import { UserContext } from '../../helpers/UserContext';
import { EtiEventContext } from '../../helpers/EtiEventContext';
import { getSignupForUserAndEvent } from '../../helpers/firestore/signups';
import WithAuthentication from '../withAuthentication';
import { CompleteProfileAlert } from '../user/components/completeProfileAlert';
import { SignupForm } from './SignupForm';
import { SignupStatusDisplay } from '../components/SignupStatusDisplay';
import { SignupClosed } from './SignupClosed';
import { Title } from './Title';
import { User } from 'firebase/auth';
import { EtiEvent } from '../../shared/etiEvent';
import { Signup, SignupStatus, SignupHelpWith, FoodChoices } from '../../shared/signup';
import { UserData } from '../../shared/User';

// Mock all child components
jest.mock('../withAuthentication', () => ({
  __esModule: true,
  default: () => <div data-testid="with-authentication">WithAuthentication Component</div>,
}));

jest.mock('../user/components/completeProfileAlert', () => ({
  CompleteProfileAlert: () => <div data-testid="complete-profile-alert">CompleteProfileAlert Component</div>,
}));

jest.mock('./SignupForm', () => ({
  SignupForm: () => <div data-testid="signup-form">SignupForm Component</div>,
}));

jest.mock('../components/SignupStatusDisplay', () => ({
  SignupStatusDisplay: () => <div data-testid="signup-status-display">SignupStatusDisplay Component</div>,
}));

jest.mock('./SignupClosed', () => ({
  SignupClosed: () => <div data-testid="signup-closed">SignupClosed Component</div>,
}));

jest.mock('./Title', () => ({
  Title: () => <div data-testid="title">Title Component</div>,
}));

// Mock Firebase function
jest.mock('../../helpers/firestore/signups', () => ({
  getSignupForUserAndEvent: jest.fn(),
}));

describe('Inscripcion Index', () => {
  const mockUser = {
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
  } as unknown as User;

  const mockEtiEvent: EtiEvent = {
    id: 'test-event-id',
    image: '',
    name: 'Test Event',
    location: 'Test Location',
    admins: [],
    capacity: 100,
    daysBeforeExpiration: 7,
    bank: {
      entity: 'Test Bank',
      holder: 'Test Holder',
      cbu: '123456789',
      alias: 'test.alias',
      cuit: '12345678901',
    },
    schedule: [],
    locations: [],
    landingTitle: 'Test Landing Title',
    comboReturnDeadlineHuman: '2024-01-01',
    lodgingCapacity: 50,
    dateStart: new Date('2024-01-01'),
    dateEnd: new Date('2024-01-07'),
    dateSignupOpen: new Date('2024-01-01'),
    comboReturnDeadline: new Date('2024-01-01'),
    prices: [],
  };

  const mockUserData: UserData = {
    city: 'Buenos Aires',
    country: 'Argentina',
    dniNumber: '12345678',
    email: 'test@example.com',
    food: FoodChoices.OMNIVORE,
    isCeliac: false,
    nameFirst: 'Test',
    nameLast: 'User',
    province: 'Buenos Aires',
    phoneNumber: '',
    disability: '',
    adminOf: [],
    lastModifiedAt: new Date() as any,
  };

  const mockSignup: Signup = {
    ...mockUserData,
    id: 'test-signup-id',
    etiEventId: 'test-event-id',
    userId: 'test-uid',
    status: SignupStatus.PAYMENT_PENDING,
    didAttend: false,
    orderNumber: 1,
    lastModifiedAt: new Date(),
    dateArrival: new Date('2024-01-01'),
    dateDeparture: new Date('2024-01-07'),
    helpWith: SignupHelpWith.CLEANING,
    wantsLodging: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderInscripcion = (user = mockUser, etiEvent = mockEtiEvent) => {
    return render(
      <UserContext.Provider value={{ user, setUser: jest.fn() }}>
        <EtiEventContext.Provider value={{ etiEvent, setEtiEvent: jest.fn() }}>
          <Index />
        </EtiEventContext.Provider>
      </UserContext.Provider>
    );
  };

  it('should render loading state initially', () => {
    (getSignupForUserAndEvent as jest.Mock).mockImplementation(
      (uid: string, eventId: string, setSignup: (signup: Signup | null) => void, setLoading: (loading: boolean) => void) => {
        setLoading(true);
      }
    );
    renderInscripcion();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render "El próximo ETI viene pronto!" when no event is available', async () => {
    renderInscripcion(mockUser, undefined);
    await waitFor(() => {
      expect(screen.getByText('El próximo ETI viene pronto!')).toBeInTheDocument();
    });
  });

  it('should fetch signup details when user and event are available', async () => {
    renderInscripcion();
    await waitFor(() => {
      expect(getSignupForUserAndEvent).toHaveBeenCalledWith(
        mockUser.uid,
        mockEtiEvent.id,
        expect.any(Function),
        expect.any(Function)
      );
    });
  });

  it('should render signup form when signup is open and user has no signup', async () => {
    (getSignupForUserAndEvent as jest.Mock).mockImplementation(
      (uid: string, eventId: string, setSignup: (signup: Signup | null) => void, setLoading: (loading: boolean) => void) => {
        setSignup(null);
        setLoading(false);
      }
    );

    renderInscripcion();
    await waitFor(() => {
      expect(screen.getByTestId('signup-form')).toBeInTheDocument();
      expect(screen.queryByTestId('signup-status-display')).not.toBeInTheDocument();
    });
  });

  it('should render signup status display when user has an existing signup', async () => {
    (getSignupForUserAndEvent as jest.Mock).mockImplementation(
      (uid: string, eventId: string, setSignup: (signup: Signup | null) => void, setLoading: (loading: boolean) => void) => {
        setSignup(mockSignup);
        setLoading(false);
      }
    );

    renderInscripcion();
    await waitFor(() => {
      expect(screen.getByTestId('signup-status-display')).toBeInTheDocument();
      expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
    });
  });

  it('should render signup closed message when signup is not open', async () => {
    const closedEvent: EtiEvent = {
      ...mockEtiEvent,
      dateSignupOpen: new Date('2025-12-31'), // Future date to ensure signup is closed
    };

    renderInscripcion(mockUser, closedEvent);
    await waitFor(() => {
      expect(screen.getByTestId('signup-closed')).toBeInTheDocument();
      expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
    });
  });

  it('should render WithAuthentication and CompleteProfileAlert components', () => {
    renderInscripcion();
    expect(screen.getByTestId('with-authentication')).toBeInTheDocument();
    expect(screen.getByTestId('complete-profile-alert')).toBeInTheDocument();
  });

  it('should render Title component with event data', () => {
    renderInscripcion();
    expect(screen.getByTestId('title')).toBeInTheDocument();
  });
}); 