import { createContext } from 'react';
import { IUser, UserChange } from '../shared/User';

export const UserContext = createContext({
  user: {} as IUser,
  // eslint-disable-next-line no-unused-vars
  setUser: (user: IUser) => {}
});
UserContext.displayName = 'UserContext';

export interface IUserContext {
  user: IUser;
  // eslint-disable-next-line no-unused-vars
  setUser: (change: UserChange) => void;
}
