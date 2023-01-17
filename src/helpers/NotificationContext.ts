import { createContext } from 'react';
import { AlertProps } from '@mui/material';

export const NotificationContext = createContext({
  visible: false,
  notificationProps: {},
  notificationText: '',
  // eslint-disable-next-line no-unused-vars
  setNotification: (notificationText: string, notificationProps?: AlertProps) => {}
});

export interface INotificationContext {
  visible: boolean;
  alertProps: AlertProps;
  notificationText: string;
  // eslint-disable-next-line no-unused-vars
  setNotification: (notificationText: string, notificationProps?: AlertProps) => void;
}
