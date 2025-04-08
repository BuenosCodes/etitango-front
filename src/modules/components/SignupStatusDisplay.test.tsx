import React from 'react';
import { render, screen } from '@testing-library/react';
import { SignupStatusDisplay } from './SignupStatusDisplay';
import { EtiEventContext } from '../../helpers/EtiEventContext';
import { SCOPES } from '../../helpers/constants/i18n';
import { I18nextProvider } from 'react-i18next';
import { Signup, SignupStatus } from '../../shared/signup';
import { EtiEvent } from '../../shared/etiEvent';
import { mockEvent, mockSignup, createMockEvent, createMockSignup } from '../../__mocks__';
import { mockI18n } from '../../__mocks__';

// Mock i18n
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock the ReceiptUpload component
jest.mock('../../components/receiptUpload/index', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-receipt-upload">Mock Receipt Upload</div>,
}));

// Mock the ResetSignup component
jest.mock('../inscripcion/ResetSignup', () => ({
  ResetSignup: () => <div data-testid="reset-signup">Reset Signup Component</div>,
}));

describe('SignupStatusDisplay', () => {
  const mockSetEtiEvent = jest.fn();

  const renderSignupStatusDisplay = (signupDetails: Signup) => {
    return render(
      <I18nextProvider i18n={mockI18n.i18n}>
        <EtiEventContext.Provider value={{ etiEvent: mockEvent, setEtiEvent: mockSetEtiEvent }}>
          <SignupStatusDisplay signupDetails={signupDetails} />
        </EtiEventContext.Provider>
      </I18nextProvider>
    );
  };

  it('should not render when signupDetails is missing', () => {
    const { container } = render(
      <I18nextProvider i18n={mockI18n.i18n}>
        <EtiEventContext.Provider value={{ etiEvent: mockEvent, setEtiEvent: mockSetEtiEvent }}>
          <SignupStatusDisplay signupDetails={undefined as any} />
        </EtiEventContext.Provider>
      </I18nextProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should not render when etiEvent is missing', () => {
    const { container } = render(
      <I18nextProvider i18n={mockI18n.i18n}>
        <EtiEventContext.Provider value={{ etiEvent: {} as EtiEvent, setEtiEvent: mockSetEtiEvent }}>
          <SignupStatusDisplay signupDetails={mockSignup} />
        </EtiEventContext.Provider>
      </I18nextProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should display the already signed up message', () => {
    renderSignupStatusDisplay(mockSignup);
    expect(screen.getByText(`${SCOPES.MODULES.SIGN_UP}.alreadySignedUpReason`)).toBeInTheDocument();
  });

  it('should render ReceiptUpload when status is not CANCELLED', () => {
    renderSignupStatusDisplay(mockSignup);
    expect(screen.getByTestId('receipt-upload')).toBeInTheDocument();
    expect(screen.queryByTestId('reset-signup')).not.toBeInTheDocument();
  });

  it('should render ResetSignup when status is CANCELLED', () => {
    const cancelledSignup = createMockSignup({
      status: SignupStatus.CANCELLED,
    });
    renderSignupStatusDisplay(cancelledSignup);
    expect(screen.getByTestId('reset-signup')).toBeInTheDocument();
    expect(screen.queryByTestId('receipt-upload')).not.toBeInTheDocument();
  });
}); 