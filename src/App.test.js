import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { UserContext } from './helpers/UserContext';

// Mock etiFirebase
jest.mock('./etiFirebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn(); // This is the unregisterAuthObserver function
    }),
    signOut: jest.fn(),
    signIn: jest.fn()
  },
  db: {},
  functions: {},
  storage: {}
}));

// Mock firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn()
}));

// Mock firebase/auth
jest.mock('firebase/auth', () => {
  const unsubscribe = jest.fn();
  return {
    getAuth: jest.fn(() => ({
      currentUser: null,
      onAuthStateChanged: jest.fn((callback) => {
        callback(null);
        return unsubscribe;
      })
    })),
    onAuthStateChanged: jest.fn()
  };
});

// Mock firebase firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  Timestamp: {
    fromDate: jest.fn(() => ({
      toDate: jest.fn(() => new Date()),
      seconds: 0,
      nanoseconds: 0
    }))
  }
}));

// Mock firebase functions
jest.mock('firebase/functions', () => ({
  getFunctions: jest.fn()
}));

// Mock firebase storage
jest.mock('firebase/storage', () => ({
  getStorage: jest.fn()
}));

// Mock events
jest.mock('./helpers/firestore/events', () => ({
  getFutureEti: jest.fn().mockResolvedValue({
    id: 'test-event-id',
    name: 'Test ETI Event',
    dateStart: new Date(),
    dateEnd: new Date(),
    dateSignupOpen: new Date(),
    comboReturnDeadline: new Date(),
    location: 'Test Location',
    prices: [],
    image: '',
    admins: [],
    capacity: 100,
    daysBeforeExpiration: 7,
    bank: {
      entity: 'Test Bank',
      holder: 'Test Holder',
      cbu: '123456789',
      alias: 'test.alias',
      cuit: '123456789'
    },
    schedule: [],
    locations: [],
    landingTitle: 'Test Landing',
    comboReturnDeadlineHuman: '7 days',
    lodgingCapacity: 100
  })
}));

// Mock isAdminOfEvent
jest.mock('./helpers/firestore/users', () => ({
  isAdminOfEvent: jest.fn().mockReturnValue(false),
  isSuperAdmin: jest.fn().mockReturnValue(false),
  getUser: jest.fn().mockResolvedValue({
    uid: 'test-uid',
    email: 'test@example.com',
    roles: []
  })
}));

// Mock the UserContext
const mockUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  emailVerified: true
};

// Mock the components that are rendered by routes
jest.mock('./modules/home/Home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}));

jest.mock('./modules/inscripcion', () => ({
  Inscripcion: () => <div data-testid="signup-page">Signup Page</div>
}));

jest.mock('./modules/user', () => ({
  UserHome: () => <div data-testid="user-home">User Home</div>
}));

jest.mock('./modules/admin/admin', () => ({
  default: () => <div data-testid="admin-page">Admin Page</div>
}));

jest.mock('./modules/superAdmin', () => ({
  SuperAdmin: () => <div data-testid="super-admin-page">Super Admin Page</div>
}));

const renderApp = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <UserContext.Provider value={{ user: mockUser, setUser: jest.fn() }}>
        <App />
      </UserContext.Provider>
    </MemoryRouter>
  );
};

describe('App', () => {
  it('should render the app without crashing', () => {
    renderApp();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should render the navigation menu', () => {
    renderApp();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render the footer', () => {
    renderApp();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should render the home page by default', () => {
    renderApp();
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('should render the signup page when navigating to /signup', () => {
    renderApp(['/signup']);
    expect(screen.getByTestId('signup-page')).toBeInTheDocument();
  });

  it('should render the user home page when navigating to /user', () => {
    renderApp(['/user']);
    expect(screen.getByTestId('user-home')).toBeInTheDocument();
  });

  it('should render the admin page when navigating to /admin', () => {
    renderApp(['/admin']);
    expect(screen.getByTestId('admin-page')).toBeInTheDocument();
  });

  it('should render the super admin page when navigating to /super-admin', () => {
    renderApp(['/super-admin']);
    expect(screen.getByTestId('super-admin-page')).toBeInTheDocument();
  });

  it('should render the 404 page for unknown routes', () => {
    renderApp(['/unknown-route']);
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });
});
