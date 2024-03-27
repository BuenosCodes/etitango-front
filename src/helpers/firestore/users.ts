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

export const getAllUsers = async (setUsuarios: Function, setIsLoading: Function) => {
  try {
    const usersRef = collection(db, USERS);
    const querySnapshot = await getDocs(usersRef);
    const usersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as UserFullData[];
    setUsuarios(usersData);
    setIsLoading(false);
    return () => {};
  } catch (error) {
    alert('Error getting users:' + error);
    throw error;
  }
};

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
      users = docs.filter((d) => Object.values(d.roles).find((e) => e));
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
  return createOrUpdateDoc(USERS, { roles: { [UserRoles.SUPER_ADMIN]: true } }, doc.id);
}

export async function assignEventAdmin(emails: string | string[], eventId: string) {
  const batch = writeBatch(db);

  const emailList = Array.isArray(emails) ? emails : [emails];

  for (const email of emailList) {
    const userDoc = await getUserByEmail(email);

    if (userDoc) {
      const eventRef = doc(db, `${EVENTS}/${eventId}`);
      batch.update(eventRef, { admins: arrayUnion(userDoc.id) });

      const userRef = doc(db, `${USERS}/${userDoc.id}`);
      batch.update(
        userRef,
        {
          // @ts-ignore
          roles: { [UserRoles.ADMIN]: true },
          adminOf: arrayUnion(eventId)
        },
        { merge: true }
      );
    }
  }

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

export const fullName = (user: UserFullData): string => {
  const { nameFirst, nameLast } = user;

  if (nameFirst && nameLast) {
    const firstNameWords = nameFirst.split(' ');
    const lastNameWords = nameLast.split(' ');
    const firstName = firstNameWords[0];
    const lastName = lastNameWords[0];

    const fullName = `${firstName} ${lastName}`;

    if (fullName.length > 16) {
      return firstName;
    } else {
      return fullName;
    }
  } else {
    return 'Name not available';
  }
};
