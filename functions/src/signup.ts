import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/common/providers/https';
import { db } from './index';
import { validateUserIsLoggedIn, validateUserOwnsTheEvent } from './validators';
import { Signup, SignupCreate, SignupStatus } from '../../src/shared/signup';
import { getIncrement } from './counters';
import { UserData } from '../../src/shared/User';
import { EtiEvent } from '../../src/shared/etiEvent';
//import { EtiEvent } from '../../src/shared/etiEvent';

const validateSingleSignup = async (userId: string, etiEventId: string) => {
  const signupRef = db.collection('signups');
  const signupDoc = await signupRef
    .where('userId', '==', userId)
    .where('etiEventId', '==', etiEventId)
    .where('status', '!=', SignupStatus.CANCELLED)
    .get();
  if (!signupDoc.empty) {
    const signup = signupDoc.docs[0];
    const signUpData = signup.data();
    throw new functions.https.HttpsError(
      'already-exists',
      'You are already signed up for this event',
      { ...signUpData, id: signup.id }
    );
  }
};

async function validateSignupIsOpen(etiEventId: string) {
  const eventRef = db.doc(`events/${etiEventId}`);
  const event = await eventRef.get();

  if (event.data()?.dateSignupOpen.toDate().getTime() > new Date().getTime()) {
    throw new functions.https.HttpsError('failed-precondition', "Signups haven't opened yet");
  }
}

function getUserIdOrFail(context: CallableContext) {
  const userId = context.auth?.uid;
  if (!userId) {
    throw new functions.https.HttpsError('failed-precondition', 'createSignup: missing Auth/uid');
  }
  return userId;
}

export const createSignup = functions.https.onCall(
  async (data: SignupCreate, context: CallableContext) => {
    validateUserIsLoggedIn(context);
    const userId = getUserIdOrFail(context);
    await db.runTransaction(async (transaction) => {
      await validateSignupIsOpen(data.etiEventId);
      await validateSingleSignup(userId, data.etiEventId);
      const userRef = db.collection('users').doc(userId);
      const user = await userRef.get();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { roles, ...userData } = <UserData>user.data();
      const signupData = {
        ...userData,
        ...data,
        dateArrival: new Date(data.dateArrival),
        dateDeparture: new Date(data.dateDeparture)
      };
      const orderNumber = await getIncrement({ transaction, counterName: data.etiEventId });
      const docRef = db.collection('signups').doc();
      return transaction.set(docRef, { ...signupData, orderNumber });
    });
    return { success: true };
  }
);

export const resetSignup = functions.https.onCall(
  async (data: { signupId: string; etiEventId: string }, context: CallableContext) => {
    await validateUserIsLoggedIn(context);
    const userId = getUserIdOrFail(context);
    await db.runTransaction(async (transaction) => {
      await validateSignupIsOpen(data.etiEventId);
      await validateSingleSignup(userId, data.etiEventId);
      const signupRef = db.collection('signups').doc(data.signupId);
      const signup = await signupRef.get();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, status, ...signupData } = <Signup>signup.data();
      const orderNumber: number = await getIncrement({ transaction, counterName: data.etiEventId });
      const docRef = db.collection('signups').doc();
      const finalData = { ...signupData, orderNumber, status: SignupStatus.WAITLIST };
      console.log('saving', finalData);
      return transaction.set(docRef, finalData);
    });
    return { success: true };
  }
);

const subtractDays = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const advanceStatusPending = async (
  etiEventId: string,
  from: SignupStatus[],
  to: SignupStatus,
  days: number
) => {
  const signupRef = db.collection('signups');
  const todayMinus = subtractDays(days);
  const signupDocsSnapshot = await signupRef
    .where('etiEventId', '==', etiEventId)
    .where('status', 'in', from)
    .where('lastModifiedAt', '<=', todayMinus)
    .get();
  const updatePromises: Promise<any>[] = [];
  signupDocsSnapshot.forEach((doc) => {
    const updatePromise = doc.ref.update({
      status: to
    });
    updatePromises.push(updatePromise);
  });
  await Promise.all(updatePromises);
  return updatePromises.length;
};

const advanceStatusWaitlist = async (
  etiEventId: string,
  from: SignupStatus,
  to: SignupStatus,
  remainingCapacity: number
) => {
  const signupRef = db.collection('signups');
  const signupDocsSnapshot = await signupRef
    .where('etiEventId', '==', etiEventId)
    .where('status', '==', from)
    .orderBy('orderNumber', 'asc')
    .limit(remainingCapacity)
    .get();

  const updatePromises: Promise<any>[] = [];
  signupDocsSnapshot.forEach((doc) => {
    const updatePromise = doc.ref.update({
      status: to
    });
    updatePromises.push(updatePromise);
  });
  await Promise.all(updatePromises);
  return updatePromises.length;
};

export async function doAdvanceSignups(etiEvent: any) {
  const { capacity, daysBeforeExpiration, id } = etiEvent;
  const signupRef = db.collection('signups');
  const signupDocsSnapshot = await signupRef
    .where('etiEventId', '==', id)
    .where('status', 'in', [
      SignupStatus.PAYMENT_PENDING,
      SignupStatus.PAYMENT_TO_CONFIRM,
      SignupStatus.FLAGGED,
      SignupStatus.CONFIRMED
    ])
    .get();
  let remainingCapacity = capacity - signupDocsSnapshot.size;
  remainingCapacity += await advanceStatusPending(
    id,
    [SignupStatus.PAYMENT_PENDING, SignupStatus.FLAGGED],
    SignupStatus.CANCELLED,
    daysBeforeExpiration
  );
  await advanceStatusWaitlist(
    id,
    SignupStatus.WAITLIST,
    SignupStatus.PAYMENT_PENDING,
    remainingCapacity
  );
  return { success: true };
}

export const advanceSignups = functions.https.onCall(
  async ({ etiEventId }: { etiEventId: string }, context: CallableContext) => {
    validateUserIsLoggedIn(context);

    const eventRef = db.collection('events').doc(etiEventId);
    const event = await eventRef.get();
    const etiEvent = <EtiEvent>event.data();

    validateUserOwnsTheEvent(context, etiEvent.admins);

    return await doAdvanceSignups({ ...etiEvent, id: etiEventId });
  }
);

export const validateSignup = functions.https.onCall(
  async (data: { etiEventId: string }, context: CallableContext) => {
    validateUserIsLoggedIn(context);
    const userId = getUserIdOrFail(context);
    await validateSingleSignup(userId, data.etiEventId);
  }
);
