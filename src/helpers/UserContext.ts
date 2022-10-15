import { createContext } from 'react';
import { IUser, UserChange, UserRoles } from '../shared/User';

export const UserContext = createContext({
  user: { data: { roles: [] as UserRoles[] } },
  setUser: () => {}
});
UserContext.displayName = 'UserContext';

export interface IUserContext {
  user: IUser;
  // eslint-disable-next-line no-unused-vars
  setUser: (change: UserChange) => void;
}
