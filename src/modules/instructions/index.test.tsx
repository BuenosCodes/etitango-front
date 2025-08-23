import React from 'react';
import { render, screen } from '@testing-library/react';
import Instructions from './index';
import YouTube from 'react-youtube';

// Mock react-youtube component
jest.mock('react-youtube', () => ({
  __esModule: true,
  default: () => <div data-testid="youtube-player">YouTube Player</div>,
}));

// Mock i18next
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Instructions', () => {
  it('should render the instructions title', () => {
    render(<Instructions />);
    expect(screen.getByText('instructions')).toBeInTheDocument();
  });

  it('should render the YouTube player', () => {
    render(<Instructions />);
    expect(screen.getByTestId('youtube-player')).toBeInTheDocument();
  });

  it('should have correct layout structure', () => {
    render(<Instructions />);
    
    // Check for Grid container
    const container = screen.getByTestId('grid-container');
    expect(container).toHaveClass('MuiGrid-container');
    expect(container).toHaveClass('MuiGrid-direction-xs-column');
    expect(container).toHaveClass('MuiGrid-spacing-xs-3');

    // Check for Grid items
    const items = screen.getAllByTestId('grid-item');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveClass('MuiGrid-item');
  });

  it('should render title with correct typography props', () => {
    render(<Instructions />);
    const title = screen.getByText('instructions');
    expect(title).toHaveClass('MuiTypography-h5');
    expect(title).toHaveClass('MuiTypography-alignCenter');
  });
}); 