import { getDocument } from './index';

export const USERS = 'users';
const USER = (userId) => `${USERS}/${userId}`;

export const getUser = async (userId) => getDocument(USER(userId));
