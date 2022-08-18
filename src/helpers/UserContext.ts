import {createContext} from "react";
import {IUser, UserChange} from "../../shared/User";

export const UserContext = createContext({
    user: {}, setUser: () => {
    }
});
UserContext.displayName = 'UserContext';

export interface IUserContext {
    user: IUser;
    setUser: (change: UserChange) => void;
}