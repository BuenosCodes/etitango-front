import { createDoc, getDocument } from './index';
import { collection, getDocs, query, Timestamp, where } from 'firebase/firestore';
import { db } from '../../etiFirebase';
import { Signup, SignupCreate } from '../../../shared/signup';

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
