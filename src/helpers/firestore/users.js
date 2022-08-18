import { getDocument } from './index';

const USERS = 'users';
const USER = (userId) => `${USERS}/${userId}`;

export const getUser = async (userId) => getDocument(USER(userId));
