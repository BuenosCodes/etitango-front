import { collection, deleteField, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../etiFirebase';
import { createOrUpdateDoc, getDocument } from './index';
import { UserFullData, UserRoles } from '../../shared/User';

export const USERS = 'users';
const USER = (userId: string) => `${USERS}/${userId}`;

export const getUser = (userId: string) => <Promise<UserFullData>>getDocument(USER(userId));

export async function getAdmins() {
  const ref = collection(db, USERS);
  const q = query(ref, where('roles', '!=', null));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as UserFullData[];
}

const getUsersByEmail = async (email: string) => {
  const ref = collection(db, USERS);
  const q = query(ref, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as UserFullData[];
};

export async function addRole(email: string, role: UserRoles) {
  const docs = await getUsersByEmail(email);
  return docs.map((doc) => createOrUpdateDoc(USERS, { roles: { [role]: true } }, doc.id));
}

export async function removeRole(id: string, role: UserRoles) {
  return createOrUpdateDoc(USERS, { roles: { [role]: deleteField() } }, id);
}
