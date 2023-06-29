import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

export function Alert({
  open,
  handleClose,
  title,
  description,
  onClick,
  buttonText,
  cancelButtonText
}: {
  open: boolean;
  handleClose: () => void;
  title?: string;
  description?: string;
  onClick: () => void;
  buttonText: string;
  cancelButtonText: string;
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      {description && (
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      )}
      {buttonText && (
        <DialogActions>
          <Button onClick={onClick} autoFocus variant={'contained'} color={'secondary'}>
            {buttonText}
          </Button>
          {cancelButtonText &&
            <Button onClick={handleClose} variant={'contained'} color={'secondary'}>
              {cancelButtonText}
            </Button>}
        </DialogActions>
      )}
    </Dialog>
  );
}
