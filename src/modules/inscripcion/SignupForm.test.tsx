import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from './SignupForm';
import { createSignup } from '../../helpers/firestore/signups';
import { UserContext } from '../../helpers/UserContext';
import { EtiEventContext } from '../../helpers/EtiEventContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../App';
import { mockRegularUser, mockEvent, createMockUser, createMockEvent } from '../../__mocks__';
import { FoodChoices, SignupHelpWith } from '../../shared/signup';
import { Timestamp } from 'firebase/firestore';

// Mock react-router-dom
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock the dependencies
jest.mock('../../helpers/firestore/signups', () => ({
  createSignup: jest.fn()
}));

// Mock the LocationPicker component
jest.mock('../../components/form/LocationPicker', () => ({
  LocationPicker: () => <div data-testid="location-picker">LocationPicker Component</div>
}));

// Mock the ETIDatePicker component
jest.mock('../../components/form/DatePicker', () => ({
  ETIDatePicker: ({ label, fieldName, setFieldValue }: any) => (
    <input
      data-testid={`date-picker-${fieldName}`}
      type="date"
      onChange={(e) => setFieldValue(fieldName, new Date(e.target.value))}
      aria-label={label}
    />
  )
}));

// Mock the ComboPricingDisplay component
jest.mock('../components/ComboPricingDisplay', () => ({
  ComboPricingDisplay: () => <div data-testid="combo-pricing">ComboPricingDisplay Component</div>
}));

describe('SignupForm', () => {
  const mockUser = createMockUser({
    uid: 'test-user-id',
    email: 'test@example.com',
    emailVerified: false,
    data: {
      id: 'test-user-id',
      nameFirst: 'John',
      nameLast: 'Doe',
      dniNumber: '12345678',
      food: FoodChoices.OMNIVORE,
      isCeliac: false,
      country: 'Argentina',
      province: 'Buenos Aires',
      city: 'Ciudad Autónoma de Buenos Aires',
      email: 'test@example.com',
      phoneNumber: '',
      disability: '',
      adminOf: [],
      roles: {},
      lastModifiedAt: Timestamp.fromDate(new Date())
    }
  });

  const mockEtiEvent = createMockEvent({
    id: 'test-event-id',
    dateStart: new Date('2024-01-01'),
    dateEnd: new Date('2024-01-07'),
    dateSignupOpen: new Date('2023-12-01'),
    comboReturnDeadline: new Date('2024-01-15'),
    prices: [
      {
        deadline: new Date('2024-01-15'),
        price: 1000,
        deadlineHuman: 'January 15, 2024'
      }
    ]
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderSignupForm = () => {
    return render(
      <UserContext.Provider value={{ user: mockUser, setUser: jest.fn() }}>
        <EtiEventContext.Provider value={{ etiEvent: mockEtiEvent, setEtiEvent: jest.fn() }}>
          <SignupForm />
        </EtiEventContext.Provider>
      </UserContext.Provider>
    );
  };

  it('should render all form fields', () => {
    renderSignupForm();

    // Check for required form elements
    expect(screen.getByTestId('date-picker-dateArrival')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker-dateDeparture')).toBeInTheDocument();
    expect(screen.getByLabelText('helpWith')).toBeInTheDocument();
    expect(screen.getByTestId('location-picker')).toBeInTheDocument();
    expect(screen.getByLabelText('wantsLodging')).toBeInTheDocument();
    expect(screen.getByTestId('combo-pricing')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument();
  });

  it('should handle form submission successfully', async () => {
    (createSignup as jest.Mock).mockResolvedValue({});
    renderSignupForm();

    // Fill in the form
    const helpWithSelect = screen.getByLabelText('helpWith');
    fireEvent.mouseDown(helpWithSelect);
    fireEvent.click(screen.getByText('cleaning'));

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(submitButton);

    // Wait for the submission to complete
    await waitFor(() => {
      expect(createSignup).toHaveBeenCalledWith(
        mockEtiEvent.id,
        mockUser.uid,
        expect.objectContaining({
          helpWith: SignupHelpWith.CLEANING,
          food: FoodChoices.OMNIVORE,
          isCeliac: false,
          country: 'Argentina',
          province: 'Buenos Aires',
          city: 'Ciudad Autónoma de Buenos Aires',
          wantsLodging: false
        })
      );
    });

    // Check navigation
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SIGNUPS);
  });

  it('should handle form submission error', async () => {
    const error = new Error('Submission failed');
    (createSignup as jest.Mock).mockRejectedValue(error);
    renderSignupForm();

    // Fill in the form
    const helpWithSelect = screen.getByLabelText('helpWith');
    fireEvent.mouseDown(helpWithSelect);
    fireEvent.click(screen.getByText('cleaning'));

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(submitButton);

    // Wait for the submission to complete
    await waitFor(() => {
      expect(createSignup).toHaveBeenCalled();
    });

    // Check that navigation did not occur
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should validate required fields', async () => {
    renderSignupForm();

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(submitButton);

    // Wait for validation messages
    await waitFor(() => {
      expect(screen.getByText('Este campo no puede estar vacío')).toBeInTheDocument();
    });

    // Check that submission did not occur
    expect(createSignup).not.toHaveBeenCalled();
  });

  it('should handle lodging option correctly', async () => {
    (createSignup as jest.Mock).mockResolvedValue({});
    renderSignupForm();

    // Fill in the form
    const helpWithSelect = screen.getByLabelText('helpWith');
    fireEvent.mouseDown(helpWithSelect);
    fireEvent.click(screen.getByText('cleaning'));

    // Check lodging option
    const lodgingCheckbox = screen.getByLabelText('wantsLodging');
    fireEvent.click(lodgingCheckbox);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(submitButton);

    // Wait for the submission to complete
    await waitFor(() => {
      expect(createSignup).toHaveBeenCalledWith(
        mockEtiEvent.id,
        mockUser.uid,
        expect.objectContaining({
          helpWith: SignupHelpWith.CLEANING,
          food: FoodChoices.OMNIVORE,
          isCeliac: false,
          country: 'Argentina',
          province: 'Buenos Aires',
          city: 'Ciudad Autónoma de Buenos Aires',
          wantsLodging: true
        })
      );
    });

    // Check navigation
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SIGNUPS);
  });
}); 