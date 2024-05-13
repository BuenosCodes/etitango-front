import { CallableContext } from 'firebase-functions/lib/common/providers/https';
import { db } from './index';
import { firestore } from 'firebase-admin';
import { validateUserIsSuperAdmin } from './validators';
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const functions = require('firebase-functions');

export const fixNumbering = functions.https.onCall(
  async (etiEventId: string, context: CallableContext) => {
    await validateUserIsSuperAdmin(context);
    const signupsRef = db.collection('signups');
    const signups = await signupsRef
      .where('etiEventId', '==', etiEventId)
      .orderBy('orderNumber', 'asc')
      .get();
    const updates: { id: string; orderNumber: number }[] = [];
    signups.docs.forEach((doc: QueryDocumentSnapshot, i: number) => {
      return updates.push({ id: doc.id, orderNumber: i + 1 });
    });
    await Promise.all(
      updates.map(async ({ id, orderNumber }) =>
        db.doc('signups/' + id).set({ orderNumber }, { merge: true })
      )
    );
  }
);
