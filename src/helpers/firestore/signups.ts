import { createOrUpdateDoc, getCollection, getDocument } from './index';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db, functions } from '../../etiFirebase';
import { Signup, SignupFirestore, SignupStatus } from '../../shared/signup';
import { httpsCallable } from 'firebase/functions';
import { BankFirestore, BANKS } from './banks';

const SIGNUPS = `signups`;
const SIGNUP = (signupId: string) => `${SIGNUPS}/${signupId}`;

interface SignupDetails extends Signup {
  alias?: string;
}

export const getSignups = async (
  etiEventId: string,
  isAdmin: boolean,
  setSignups: Function,
  setIsLoading: Function
) => {
  const ref = collection(db, SIGNUPS);
  let banks: BankFirestore[] = [];
  if (isAdmin) {
    banks = (await getCollection(BANKS)) as BankFirestore[];
  }
  const addBank = (doc: Signup) => {
    return { ...doc, alias: getAliasForUserId(banks, doc.userId) };
  };
  const q = query(ref, where('etiEventId', '==', etiEventId), orderBy('orderNumber'));

  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      };
    }) as SignupFirestore[];
    let signups: SignupDetails[] = docs.map(toJs);
    if (isAdmin) {
      signups = signups.map(addBank);
    }
    setSignups(signups);
    setIsLoading(false);
  });
};

const getAliasForUserId = (banks: BankFirestore[], userId: string) => {
  for (const bank of banks) {
    if (bank.id === userId) {
      return bank.bank;
    }
  }
  return '';
};

const toJs = (signup: SignupFirestore) =>
  ({
    ...signup,
    dateDeparture: signup.dateDeparture?.toDate(),
    dateArrival: signup.dateArrival?.toDate(),
    dateEnd: signup.dateDeparture?.toDate(),
    lastModifiedAt: signup.lastModifiedAt?.toDate()
  } as Signup);

export const getSignup = async (signupId: string) => getDocument(SIGNUP(signupId));

export const createSignup = async (etiEventId: string, userId: string, data: Signup) => {
  const signupData = {
    ...data,
    userId,
    etiEventId
  };
  const createSignup = httpsCallable(functions, 'signup-createSignup');
  try {
    return createSignup(signupData);
  } catch (e) {
    console.log(e);
  }
};

export const validateSignUp = async (etiEventId: string) => {
  const validateSignUp = httpsCallable(functions, 'signup-validateSignup');
  try {
    return validateSignUp({ etiEventId });
  } catch (e) {
    console.log(e);
  }
};

export const createEmail = async () =>
  Object.values(SignupStatus).map((status) =>
    createOrUpdateDoc('mail', {
      toUids: ['3YMkn4rGwHdb3dD5NXxR2okR4JNa'],
      template: {
        name: status,
        data: {
          username: 'ada',
          name: 'Ada Lovelace'
        }
      }
    })
  );

export const createSeeds = async () => {
  const seeds = httpsCallable(functions, 'seeds-seedDatabase');
  try {
    await seeds();
  } catch (e) {
    console.log(e);
  }
};

export async function updateSignupsStatus(selectedStatus: SignupStatus, selectedRows: string[]) {
  return Promise.all(
    selectedRows.map((id) => createOrUpdateDoc('signups', { status: selectedStatus }, id))
  );
}
