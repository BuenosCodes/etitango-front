import { getDocument } from './index';

export const BANKS = 'banks';
const BANK = (userId: string) => `${BANKS}/${userId}`;

export const getBankForUser = async (userId: string) => getDocument(BANK(userId));
