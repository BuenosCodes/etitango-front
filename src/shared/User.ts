import { User } from 'firebase/auth';

export enum UserRoles {
  // eslint-disable-next-line no-unused-vars
  SUPER_ADMIN = 'superadmin',
  // eslint-disable-next-line no-unused-vars
  ADMIN = 'admin'
}

export interface UserData {
  roles: { [role: string]: boolean };
}

export interface IUser extends User {
  data?: UserData;
}
export type UserChange = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof IUser]: IUser[keyof IUser];
};
