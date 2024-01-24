/* eslint-disable prettier/prettier */
import { User } from 'firebase/auth';
import { FoodChoices } from './signup';

export enum UserRoles {
  // eslint-disable-next-line no-unused-vars
  SUPER_ADMIN = 'superadmin',
  // eslint-disable-next-line no-unused-vars
  ADMIN = 'admin'
}

export interface UserData extends UserPersonalInfo {
  roles: { [role: string]: boolean };
  adminOf: string[];
}

export interface UserFullData extends UserData {
  id: string;
}

export interface UserPersonalInfo {
  city?: string;
  country: string;
  dniNumber: string;
  email: string;
  food: FoodChoices;
  isCeliac: boolean;
  nameFirst: string;
  nameLast: string;
  province?: string;
}

export type UserRolesListData = Pick<UserFullData, 'id' | 'email' | 'nameFirst' | 'nameLast'>;

export interface IUser extends User {
  data?: UserFullData;
}

export type UserChange = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof IUser]: IUser[keyof IUser];
};
