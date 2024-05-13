import { Change, EventContext } from 'firebase-functions';
import { db } from './index';
import { Signup } from '../../src/shared/signup';
import { firestore } from 'firebase-admin';
import { UserData, UserRoles } from '../../src/shared/User';
import { getAuth } from 'firebase-admin/auth';
import DocumentSnapshot = firestore.DocumentSnapshot;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const functions = require('firebase-functions');

const updateSignup =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars


    ({ roles, ...userData }: UserData) =>
    (signup: Signup) => {
      return db.collection('signups').doc(signup.id).set(userData, { merge: true });
    };

exports.onUpdateUser = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change: Change<DocumentSnapshot<UserData>>, context: EventContext) => {
    console.info(`onUpdate triggered for users/${context.params.userId}`);
    const before = change.before.data();
    const after = change.after.data();
    const auth = getAuth();
    if (after?.roles[UserRoles.SUPER_ADMIN]) {
      await auth.setCustomUserClaims(context.params.userId, { [UserRoles.SUPER_ADMIN]: true });
    }

    if (!before || !after) return;

    const signupsRef = db.collection('signups');
    const snapshot = await signupsRef.where('userId', '==', context.params.userId).get();
    const signups = <Signup[]>[];
    snapshot.forEach((doc) => signups.push({ ...doc.data(), id: doc.id } as Signup));
    await Promise.all(signups.map(updateSignup(after)));
  });
