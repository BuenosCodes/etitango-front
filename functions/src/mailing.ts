import { Change, EventContext } from 'firebase-functions';
import { db } from './index';
import { Signup, SignupFirestore, SignupStatus } from '../../src/shared/signup';
import { firestore } from 'firebase-admin';
import DocumentSnapshot = firestore.DocumentSnapshot;
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;

const functions = require('firebase-functions');

exports.onUpdateSignup = functions.firestore
  .document('signups/{signupId}')
  .onUpdate(async (change: Change<DocumentSnapshot<Signup>>, context: EventContext) => {
    const signupId = context.params.signupId;
    console.info(`onUpdate triggered for ${signupId}`);
    const before = change.before.data();
    const after = change.after.data();
    if (!before || !after) return;
    if (before.status !== after.status) {
      const ref = change.after.ref;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref.set({ lastModifiedAt: new Date() }, { merge: true });
      const mailRef = db.collection('mail');
      await mailRef.add({
        to: [after.email],
        template: {
          name: after.status,
          data: {
            userName: after.nameFirst
          }
        },
        signupId
      });
    }
  });

exports.onCreateSignup = functions.firestore
  .document('signups/{signupId}')
  .onCreate(async (snapshot: QueryDocumentSnapshot<SignupFirestore>, context: EventContext) => {
    console.info(`OnCreate triggered for signups/${context.params.signupId}`);
    await snapshot.ref.set(
      {
        status: SignupStatus.WAITLIST,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        lastModifiedAt: new Date()
      },
      { merge: true }
    );
  });
