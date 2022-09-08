import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import { db } from './index';
import { validateUserIsLoggedIn } from './validators';

export const createUserInDB = functions.https.onCall(
  async (data: { email: string }, context: CallableContext) => {
    validateUserIsLoggedIn(context);
    const { email } = data;
    const ref = db.collection('users').doc(context.auth!.uid);
    await ref.set({ email });
  }
);
