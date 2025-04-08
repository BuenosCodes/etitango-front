import React from 'react';
import { render, screen } from '@testing-library/react';
import { ComboPricingDisplay } from './ComboPricingDisplay';
import { mockEvent, createMockEvent } from '../../__mocks__';
import { EtiEventContext } from '../../helpers/EtiEventContext';
import { SCOPES } from '../../helpers/constants/i18n';
import { I18nextProvider } from 'react-i18next';
import { EtiEvent } from '../../shared/etiEvent';
import { mockI18n } from '../../__mocks__';

// Mock i18n
jest.mock('react-i18next', () => mockI18n);

describe('ComboPricingDisplay', () => {
  const mockEtiEvent: EtiEvent = {
    id: 'test-event',
    image: 'https://example.com/image.jpg',
    name: 'Test Event',
    location: 'Test Location',
    admins: ['admin1'],
    capacity: 100,
    daysBeforeExpiration: 30,
    bank: {
      entity: 'Test Bank',
      holder: 'John Doe',
      cbu: '123456789',
      alias: 'test.alias',
      cuit: '12345678901',
    },
    schedule: [{
      title: 'Day 1',
      activities: 'Morning activities',
    }],
    locations: [{
      name: 'Main Venue',
      link: 'https://example.com/venue',
    }],
    landingTitle: 'Welcome to Test Event',
    comboReturnDeadlineHuman: 'Before event starts',
    lodgingCapacity: 50,
    dateStart: new Date('2024-01-01'),
    dateEnd: new Date('2024-01-07'),
    dateSignupOpen: new Date('2023-12-01'),
    comboReturnDeadline: new Date('2023-12-15'),
    prices: [{
      deadlineHuman: 'Early Bird',
      deadline: new Date('2023-12-01'),
      price: 1000,
    }],
  };

  const mockSetEtiEvent = jest.fn();

  const renderComboPricingDisplay = (orderNumber?: number) => {
    return render(
      <I18nextProvider i18n={mockI18n.i18n}>
        <EtiEventContext.Provider value={{ etiEvent: mockEtiEvent, setEtiEvent: mockSetEtiEvent }}>
          <ComboPricingDisplay orderNumber={orderNumber} />
        </EtiEventContext.Provider>
      </I18nextProvider>
    );
  };

  it('should display the base price without order number', () => {
    renderComboPricingDisplay();
    
    // The price should be formatted as ARS 1.000,00
    expect(screen.getByText('$ 1.000,00')).toBeInTheDocument();
    
    // Check for the attention message
    expect(screen.getByText(/ATENCIÓN: el precio final del combo/)).toBeInTheDocument();
  });

  it('should display the price with order number', () => {
    renderComboPricingDisplay(50);
    
    // The price should be base price (1000) plus order number (50) / 100 = 1000.50
    expect(screen.getByText('$ 1.000,50')).toBeInTheDocument();
  });

  it('should display the combo label', () => {
    renderComboPricingDisplay();
    
    // The combo label should be displayed
    expect(screen.getByText(`${SCOPES.MODULES.SIGN_UP}.combo:`)).toBeInTheDocument();
  });

  it('should handle missing prices array', () => {
    const eventWithoutPrices: EtiEvent = {
      ...mockEtiEvent,
      prices: [],
    };

    render(
      <I18nextProvider i18n={mockI18n.i18n}>
        <EtiEventContext.Provider value={{ etiEvent: eventWithoutPrices, setEtiEvent: mockSetEtiEvent }}>
          <ComboPricingDisplay />
        </EtiEventContext.Provider>
      </I18nextProvider>
    );

    // Should display $ 0,00 when no prices are available
    expect(screen.getByText('$ 0,00')).toBeInTheDocument();
  });

  it('should handle undefined order number', () => {
    renderComboPricingDisplay(undefined);
    
    // Should behave the same as no order number
    expect(screen.getByText('$ 1.000,00')).toBeInTheDocument();
  });

  it('should handle zero order number', () => {
    renderComboPricingDisplay(0);
    
    // Should behave the same as no order number
    expect(screen.getByText('$ 1.000,00')).toBeInTheDocument();
  });
}); 