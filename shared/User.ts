export enum UserRoles {
    ADMIN = 'admin',
}

export type IUser = {
    id: string;
    email: string;
    roles: {
        [key in keyof UserRoles]: boolean
    }
}
export type UserChange = {
    [key in keyof IUser]: IUser[keyof IUser]
}