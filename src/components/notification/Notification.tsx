import { Alert, AlertProps, Snackbar } from '@mui/material';

export const Notification = ({
  visible,
  notificationProps,
  notificationText
}: {
  visible: boolean;
  notificationProps: AlertProps;
  notificationText: string;
}) => (
  <Snackbar
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    open={visible}
    sx={{ width: '100%' }}
  >
    <Alert sx={{ width: '100%' }} {...notificationProps}>
      {notificationText}
    </Alert>
  </Snackbar>
);
