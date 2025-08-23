import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';
import { EtiEventContext } from 'helpers/EtiEventContext';

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
  const mockEtiEvent = {
    id: 'test-event',
    name: 'Test Event',
    image: 'https://example.com/image.jpg',
    landingTitle: 'Welcome to Test Event',
    locations: [
      {
        name: 'Main Venue',
        link: 'https://example.com/venue',
      },
    ],
    schedule: [
      {
        title: 'Day 1',
        activities: 'Morning activities',
      },
    ],
  };

  const renderHome = (etiEvent) => {
    return render(
      <EtiEventContext.Provider value={{ etiEvent }}>
        <Home />
      </EtiEventContext.Provider>
    );
  };

  it('should render Portada component', () => {
    renderHome(mockEtiEvent);
    expect(screen.getByTestId('portada')).toBeInTheDocument();
  });

  it('should render event image when etiEvent has an image', () => {
    renderHome(mockEtiEvent);
    const eventImage = screen.getByAltText('Proximmo ETI');
    expect(eventImage).toBeInTheDocument();
    expect(eventImage).toHaveAttribute('src', mockEtiEvent.image);
    expect(eventImage).toHaveAttribute('width', '100%');
    expect(eventImage).toHaveAttribute('height', '100%');
  });

  it('should not render event image when etiEvent has no image', () => {
    const etiEventWithoutImage = { ...mockEtiEvent, image: undefined };
    renderHome(etiEventWithoutImage);
    expect(screen.queryByAltText('Proximmo ETI')).not.toBeInTheDocument();
  });

  it('should render Cronograma component when etiEvent has an id', () => {
    renderHome(mockEtiEvent);
    expect(screen.getByTestId('cronograma')).toBeInTheDocument();
  });

  it('should not render Cronograma component when etiEvent has no id', () => {
    const etiEventWithoutId = { ...mockEtiEvent, id: undefined };
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