import {Change, EventContext} from "firebase-functions";
import {db} from "./index";
import {Signup, SignupFirestore, SignupStatus} from "../../src/shared/signup";
import {firestore} from "firebase-admin";
import DocumentSnapshot = firestore.DocumentSnapshot;
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
import FieldValue = firestore.FieldValue;

const functions = require("firebase-functions");

exports.onUpdateSignup = functions.firestore
    .document("signups/{signupId}")
    .onUpdate(async (change: Change<DocumentSnapshot<Signup>>, context: EventContext) => {
      console.info(`onUpdate triggered for ${context.params.signupId}`);
      const before = change.before.data();
      const after = change.after.data();

      if (!before || !after) return;
      if (before.status !== after.status) {
        const ref = change.after.ref;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ref.set({lastModifiedAt: FieldValue.serverTimestamp()}, {merge: true});
        const mailRef = db.collection("mail").doc(context.params.signupId + "_" + after.status);
        const mailDoc = await mailRef.get();
        if (!mailDoc.exists) {
          mailRef.set({
            to: [after.email],
            template: {
              name: after.status,
              data: {
                userName: after.nameFirst,
              },
            },
          });
        }
      }
    });

exports.onCreateSignup = functions.firestore
    .document("signups/{signupId}")
    .onCreate(async (snapshot: QueryDocumentSnapshot<SignupFirestore>, context: EventContext) => {
      console.info(`OnCreate triggered for signups/${context.params.signupId}`);
      await snapshot.ref.set(
          {status: SignupStatus.WAITLIST,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            lastModifiedAt: FieldValue.serverTimestamp()},
          {merge: true}
      );
    });
