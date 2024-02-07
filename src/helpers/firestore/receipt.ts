import { collection, doc, limit, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../etiFirebase';
import { SIGNUPS } from './signups';
import { Signup, SignupStatus } from '../../shared/signup';

export async function getNextSignup(
  setSignup: Function,
  setIsLoading: Function,
  etiEventId: string
) {
  const ref = collection(db, SIGNUPS);
  const q = query(
    ref,
    where('etiEventId', '==', etiEventId),
    where('status', '==', SignupStatus.PAYMENT_TO_CONFIRM),
    limit(1)
  );

  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      };
    }) as Signup[];

    setSignup(docs[0]);
    setIsLoading(false);
  });
}

export async function getSignup(setSignup: Function, setIsLoading: Function, signupId: string) {
  const ref = doc(db, SIGNUPS, signupId);

  return onSnapshot(ref, (snapshot) => {
    setSignup({
      id: snapshot.id,
      ...snapshot.data()
    } as Signup);
    setIsLoading(false);
  });
}
