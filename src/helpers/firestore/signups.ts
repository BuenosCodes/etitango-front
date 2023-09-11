import { createOrUpdateDoc, getCollection, getDocument } from './index';
import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db, functions, storage } from '../../etiFirebase';
import { Signup, SignupFirestore, SignupStatus } from '../../shared/signup';
import { httpsCallable } from 'firebase/functions';
import { BankFirestore, BANKS } from './banks';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const SIGNUPS = `signups`;
const SIGNUP = (signupId: string) => `${SIGNUPS}/${signupId}`;

const ALLOWED_RECEIPT_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/bmp',
  'application/pdf'
];

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

export const getSignupForUserAndEvent = async (userId: string, etiEventId: string) => {
  const ref = collection(db, SIGNUPS);
  const q = query(ref, where('etiEventId', '==', etiEventId), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return (
    querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as Signup[]
  )[0];
};

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

export const upsertTemplates = async () => {
  const seeds = httpsCallable(functions, 'seeds-upsertTemplates');
  try {
    await seeds();
  } catch (e) {
    console.log(e);
  }
};

export const fixNumbering = async (etiEventId: string) => {
  const fn = httpsCallable(functions, 'superAdmin-fixNumbering');
  try {
    await fn(etiEventId);
  } catch (e) {
    console.log(e);
  }
};

export async function updateSignupsStatus(selectedStatus: SignupStatus, selectedRows: string[]) {
  return Promise.all(
    selectedRows.map((id) => createOrUpdateDoc('signups', { status: selectedStatus }, id))
  );
}

export async function markAttendance(signup: Signup) {
  return createOrUpdateDoc('signups', { didAttend: !signup.didAttend }, signup.id);
}

export async function uploadEventReceipt(
  signupId: string,
  eventId: string,
  userId: string,
  file: File
) {
  if (!ALLOWED_RECEIPT_FILE_TYPES.includes(file.type)) {
    throw new Error('Invalid file extension');
  }
  const fileExtension = file.name.split('.').pop();
  const storageRef = ref(storage, `eventReceipts/${eventId}/${userId}.${fileExtension}`);
  const uploadFileTask = await uploadBytesResumable(storageRef, file);
  const fileUrl = await getDownloadURL(uploadFileTask.ref);
  await createOrUpdateDoc(
    SIGNUPS,
    { status: SignupStatus.PAYMENT_TO_CONFIRM, receipt: fileUrl },
    signupId
  );
  return fileUrl;
}
