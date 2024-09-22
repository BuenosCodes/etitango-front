import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteField,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from '../../etiFirebase';
import { createOrUpdateDoc, getDocument } from './index';
import { IUser, UserFullData, UserRoles } from '../../shared/User';
import { EVENTS } from './events';

export const USERS = 'users';
const USER = (userId: string) => `${USERS}/${userId}`;

export const getUser = (userId: string) => <Promise<UserFullData>>getDocument(USER(userId));

export async function getAdmins(setUsers: Function, setIsLoading: Function, etiEventId?: string) {
  const ref = collection(db, USERS);

  const isAdminOfEvent = where('adminOf', 'array-contains', etiEventId);
  let q;
  if (etiEventId) {
    q = query(ref, isAdminOfEvent);
  } else {
    q = query(ref, where('roles', '!=', null));
  }

  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      };
    }) as UserFullData[];

    let users;
    if (etiEventId) {
      users = docs.filter((d) => d.adminOf.includes(etiEventId));
    } else {
      users = docs.filter((d) => Object.values(d.roles || {}).find((e) => e));
    }

    setUsers(users);
    setIsLoading(false);
  });
}

const getUserByEmail = async (email: string) => {
  const ref = collection(db, USERS);
  const q = query(ref, where('email', '==', email), limit(1));
  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as UserFullData[];
  return docs[0];
};

export async function assignSuperAdmin(email: string) {
  const doc = await getUserByEmail(email);
  return createOrUpdateDoc(
    USERS,
    { roles: { ...doc.roles, [UserRoles.SUPER_ADMIN]: true } },
    doc.id
  );
}

export async function assignEventAdmin(email: string, etiEventId: string) {
  const userDoc = await getUserByEmail(email);
  const eventRef = doc(db, `${EVENTS}/${etiEventId}`);
  const batch = writeBatch(db);
  batch.update(eventRef, { admins: arrayUnion(userDoc.id) });
  const ref = doc(db, `${USERS}/${userDoc.id}`);
  batch.update(
    ref,
    {
      // @ts-ignore
      roles: { ...userDoc.roles, [UserRoles.ADMIN]: true },
      adminOf: arrayUnion(etiEventId)
    },
    { merge: true }
  );

  await batch.commit();
}

export async function removeSuperAdmin(email: string) {
  const userDoc = await getUserByEmail(email);
  return createOrUpdateDoc(
    USERS,
    { roles: { [UserRoles.SUPER_ADMIN]: deleteField() } },
    userDoc.id
  );
}

export async function unassignEventAdmin(email: string, etiEventId: string) {
  const userDoc = await getUserByEmail(email);
  const { id: userId } = userDoc;
  const eventRef = doc(db, `${EVENTS}/${etiEventId}`);
  const batch = writeBatch(db);
  // @ts-ignore
  batch.update(eventRef, { admins: arrayRemove(userId) }, { merge: true });

  let data: any = {
    adminOf: arrayRemove(etiEventId)
  };
  if (userDoc.adminOf.filter((e) => e !== etiEventId).length === 0) {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    data = { ...data, [`roles.${[UserRoles.ADMIN]}`]: deleteField(), adminOf: deleteField() };
  }
  const userRef = doc(db, `${USERS}/${userId}`);
  batch.update(userRef, data, { merge: true });
  await batch.commit();
}

export const isAdmin = (user: IUser) => {
  // @ts-ignore
  return !!Object.values(user?.data?.roles || {}).filter((v) => v).length > 0;
};

export const isSuperAdmin = (user: IUser) => {
  // @ts-ignore
  return !!user?.data?.roles && !!user?.data?.roles[UserRoles.SUPER_ADMIN];
};

export const isAdminOfEvent = (user: IUser, etiEventId?: string) => {
  // @ts-ignore
  return (
    !!user?.data?.roles?.[UserRoles.SUPER_ADMIN] ||
    !!user?.data?.adminOf?.find((e) => e === etiEventId)
  );
};
