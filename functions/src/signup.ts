import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/common/providers/https';
import { db } from './index';
import { validateUserIsLoggedIn, validateUserOwnsTheEvent } from './validators';
import { Signup, SignupStatus } from '../../src/shared/signup';
import { getIncrement } from './counters';
import { UserData } from '../../src/shared/User';
import { EtiEvent } from '../../src/shared/etiEvent';

const validateSingleSignup = async (
  transaction: FirebaseFirestore.Transaction,
  userId: string,
  etiEventId: string
) => {
  const signupRef = db.collection('signups');
  const query = signupRef
    .where('userId', '==', userId)
    .where('etiEventId', '==', etiEventId)
    .where('status', '!=', SignupStatus.CANCELLED);

  const signupDoc = await transaction.get(query);

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
  async (data: Signup, context: CallableContext) => {
    validateUserIsLoggedIn(context);
    const userId = getUserIdOrFail(context);
    await db.runTransaction(async (transaction) => {
      await validateSignupIsOpen(data.etiEventId);
      await validateSingleSignup(transaction, userId, data.etiEventId); // Pass the transaction
      const userRef = db.collection('users').doc(userId);
      const userSnapshot = await transaction.get(userRef);
      const { roles, ...userData } = <UserData>userSnapshot.data();
      const signupData = {
        ...userData,
        ...data,
        dateArrival: new Date(data.dateArrival),
        dateDeparture: new Date(data.dateDeparture)
      };
      const orderNumber = await getIncrement({ transaction, counterName: data.etiEventId });
      const docRef = db.collection('signups').doc();
      transaction.set(docRef, { ...signupData, orderNumber });
    });
    return { success: true };
  }
);

export const resetSignup = functions.https.onCall(
  async (data: { signupId: string; etiEventId: string }, context: CallableContext) => {
    validateUserIsLoggedIn(context);
    const userId = getUserIdOrFail(context);
    await db.runTransaction(async (transaction) => {
      await validateSignupIsOpen(data.etiEventId);
      await validateSingleSignup(transaction, userId, data.etiEventId); // Pass the transaction
      const signupRef = db.collection('signups').doc(data.signupId);
      const signupSnapshot = await transaction.get(signupRef);
      const { id, status, ...signupData } = <Signup>signupSnapshot.data();
      const orderNumber: number = await getIncrement({ transaction, counterName: data.etiEventId });
      const docRef = db.collection('signups').doc();
      const finalData = { ...signupData, orderNumber, status: SignupStatus.WAITLIST };
      console.log('saving', finalData);
      transaction.set(docRef, finalData);
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
  const query = signupRef
    .where('etiEventId', '==', etiEventId)
    .where('status', 'in', from)
    .where('lastModifiedAt', '<=', todayMinus);

  const signupDocsSnapshot = await query.get();

  // Use Firestore batch write
  const batch = db.batch();

  signupDocsSnapshot.forEach((doc) => {
    console.log(`updating signup #${doc.id}`);
    batch.update(doc.ref, { status: to });
  });

  // Commit the batch
  await batch.commit();

  return signupDocsSnapshot.size; // Return the number of documents updated
};

export const advanceStatusWaitlist = async (
  etiEventId: string,
  from: SignupStatus,
  to: SignupStatus,
  remainingCapacity: number
) => {
  const signupRef = db.collection('signups');
  const batch = db.batch(); // Create a batch write operation
  const query = signupRef
    .where('etiEventId', '==', etiEventId)
    .where('status', '==', from)
    .orderBy('orderNumber', 'asc')
    .limit(remainingCapacity);

  const signupDocsSnapshot = await query.get();

  signupDocsSnapshot.forEach((doc) => {
    console.log(`updating signup #${doc.id}`);
    batch.update(doc.ref, { status: to });
  });

  await batch.commit(); // Commit the batch write
  return signupDocsSnapshot.size; // Return the number of documents updated
};

export async function doAdvanceSignups(etiEvent: any) {
  const { capacity, daysBeforeExpiration, id } = etiEvent;
  console.log('advanceStatusPending', SignupStatus.PAYMENT_PENDING, SignupStatus.FLAGGED);
  await advanceStatusPending(
    id,
    [SignupStatus.PAYMENT_PENDING, SignupStatus.FLAGGED],
    SignupStatus.CANCELLED,
    daysBeforeExpiration
  );

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
  const remainingCapacity = capacity - signupDocsSnapshot.size;

  console.log('advanceStatusWaitlist', SignupStatus.WAITLIST, SignupStatus.PAYMENT_PENDING);

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
    console.log(`advanceSignups triggered for event/${etiEventId}`);
    console.log('user', context.auth?.uid);
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

    // Since transactions are primarily for read-write operations,
    // using them just for reads (validation in this case) might be overkill
    // unless you have specific consistency requirements.
    await db.runTransaction(async (transaction) => {
      // Now validateSingleSignup will be called within a transaction.
      // This assumes validateSingleSignup is refactored to accept a transaction.
      await validateSingleSignup(transaction, userId, data.etiEventId);
    });
  }
);
