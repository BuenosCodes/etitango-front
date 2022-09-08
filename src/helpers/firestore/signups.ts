import { createDoc, getDocument } from './index';
import { collection, getDocs, query, Timestamp, where } from 'firebase/firestore';
import { db, functions } from '../../etiFirebase';
import { Signup, SignupCreate, SignupStatus } from '../../shared/signup';
import { httpsCallable } from 'firebase/functions';

const SIGNUPS = `signups`;
const SIGNUP = (signupId: string) => `${SIGNUPS}/${signupId}`;

interface SignupFirestore extends Signup {
  dateArrival: Timestamp;
  dateDeparture: Timestamp;
}

export const getSignups = async (etiEventId: string) => {
  const ref = collection(db, SIGNUPS);
  const q = query(ref, where('etiEventId', '==', etiEventId));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as SignupFirestore[];
  return data.map(toJs);
};

const toJs = (signup: SignupFirestore) =>
  ({
    ...signup,
    dateDeparture: signup.dateDeparture?.toDate(),
    dateArrival: signup.dateArrival?.toDate(),
    dateEnd: signup.dateDeparture?.toDate()
  } as Signup);

export const getSignup = async (signupId: string) => getDocument(SIGNUP(signupId));

export const createSignup = async (etiEventId: string, userId: string, data: SignupCreate) =>
  createDoc(SIGNUPS, {
    ...data,
    userId,
    etiEventId
  });

export const createEmail = async () =>
  Object.values(SignupStatus).map((status) =>
    createDoc('mail', {
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
