import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileUpload from './FileUpload';
import { NotificationContext } from '../helpers/NotificationContext';
import { AlertProps } from '@mui/material';

// Mock the NotificationContext
const mockSetNotification = jest.fn();

const renderFileUpload = (props = {}) => {
  const defaultProps = {
    uploadFunction: jest.fn(),
    postUpload: jest.fn(),
    notifications: {
      errorMsg: 'Upload failed',
      successMsg: 'Upload successful',
    },
  };

  return render(
    <NotificationContext.Provider 
      value={{ 
        visible: false,
        notificationProps: {},
        notificationText: '',
        setNotification: mockSetNotification
      }}
    >
      <FileUpload {...defaultProps} {...props} />
    </NotificationContext.Provider>
  );
};

describe('FileUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the upload button', () => {
    renderFileUpload();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show loading state during upload', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const uploadFunction = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    renderFileUpload({ uploadFunction });

    const input = screen.getByRole('button').querySelector('input');
    expect(input).toBeInTheDocument();

    fireEvent.change(input!, { target: { files: [mockFile] } });

    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiLoadingButton-loading');

    await waitFor(() => {
      expect(button).not.toHaveClass('MuiLoadingButton-loading');
    });
  });

  it('should handle successful file upload', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const mockFileUrl = 'https://example.com/test.png';
    const uploadFunction = jest.fn().mockResolvedValue(mockFileUrl);
    const postUpload = jest.fn();

    renderFileUpload({ uploadFunction, postUpload });

    const input = screen.getByRole('button').querySelector('input');
    expect(input).toBeInTheDocument();

    fireEvent.change(input!, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(uploadFunction).toHaveBeenCalledWith(mockFile);
      expect(postUpload).toHaveBeenCalledWith(mockFileUrl);
      expect(mockSetNotification).toHaveBeenCalledWith('Upload successful', { severity: 'info' });
    });
  });

  it('should handle upload error', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const uploadFunction = jest.fn().mockRejectedValue(new Error('Upload failed'));

    renderFileUpload({ uploadFunction });

    const input = screen.getByRole('button').querySelector('input');
    expect(input).toBeInTheDocument();

    fireEvent.change(input!, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(uploadFunction).toHaveBeenCalledWith(mockFile);
      expect(mockSetNotification).toHaveBeenCalledWith('Upload failed', { severity: 'error' });
    });
  });

  it('should accept image and PDF files', () => {
    renderFileUpload();
    const input = screen.getByRole('button').querySelector('input');
    if (!input) throw new Error('Input not found');
    expect(input).toHaveAttribute('accept', 'image/*, .pdf');
  });

  it('should not call postUpload when not provided', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const mockFileUrl = 'https://example.com/test.png';
    const uploadFunction = jest.fn().mockResolvedValue(mockFileUrl);

    renderFileUpload({ uploadFunction });

    const input = screen.getByRole('button').querySelector('input');
    if (!input) throw new Error('Input not found');
    fireEvent.change(input, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(uploadFunction).toHaveBeenCalledWith(mockFile);
    });

    expect(mockSetNotification).toHaveBeenCalledWith('Upload successful', { severity: 'info' });
  });
}); 