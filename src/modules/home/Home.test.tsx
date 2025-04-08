import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';
import { EtiEventContext } from 'helpers/EtiEventContext';
import { mockEvent, createMockEvent, mockSetEtiEvent } from '../../__mocks__';
import { EtiEvent } from '../../shared/etiEvent';

// Mock the Portada component
jest.mock('./portada/Portada', () => ({
  __esModule: true,
  default: () => <div data-testid="portada">Portada Component</div>,
}));

// Mock the Cronograma component
jest.mock('./cronograma/Cronograma', () => ({
  __esModule: true,
  default: () => <div data-testid="cronograma">Cronograma Component</div>,
}));

describe('Home', () => {
  const renderHome = (etiEvent: EtiEvent | undefined) => {
    return render(
      <EtiEventContext.Provider value={{ etiEvent, setEtiEvent: mockSetEtiEvent }}>
        <Home />
      </EtiEventContext.Provider>
    );
  };

  it('should render Portada component', () => {
    renderHome(mockEvent);
    expect(screen.getByTestId('portada')).toBeInTheDocument();
  });

  it('should render event image when etiEvent has an image', () => {
    renderHome(mockEvent);
    const eventImage = screen.getByAltText('Proximmo ETI');
    expect(eventImage).toBeInTheDocument();
    expect(eventImage).toHaveAttribute('src', mockEvent.image);
    expect(eventImage).toHaveAttribute('width', '100%');
    expect(eventImage).toHaveAttribute('height', '100%');
  });

  it('should not render event image when etiEvent has no image', () => {
    const etiEventWithoutImage = createMockEvent({ image: undefined });
    renderHome(etiEventWithoutImage);
    expect(screen.queryByAltText('Proximmo ETI')).not.toBeInTheDocument();
  });

  it('should render Cronograma component when etiEvent has an id', () => {
    renderHome(mockEvent);
    expect(screen.getByTestId('cronograma')).toBeInTheDocument();
  });

  it('should not render Cronograma component when etiEvent has no id', () => {
    const etiEventWithoutId = createMockEvent({ id: undefined });
    renderHome(etiEventWithoutId);
    expect(screen.queryByTestId('cronograma')).not.toBeInTheDocument();
  });

  it('should handle undefined etiEvent', () => {
    renderHome(undefined);
    expect(screen.getByTestId('portada')).toBeInTheDocument();
    expect(screen.queryByAltText('Proximmo ETI')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cronograma')).not.toBeInTheDocument();
  });
}); 