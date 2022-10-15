export enum UserRoles {
  // eslint-disable-next-line no-unused-vars
  ADMIN = 'admin'
}

export type IUser = {
  id: string;
  email: string;
  data: { roles: Map<UserRoles, boolean> };
};
export type UserChange = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof IUser]: IUser[keyof IUser];
};
