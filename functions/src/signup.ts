import * as functions from "firebase-functions";
import {CallableContext} from "firebase-functions/lib/common/providers/https";
import {db} from "./index";
import {validateUserIsLoggedIn} from "./validators";
import {SignupCreate} from "../../src/shared/signup";
import {getIncrement} from "./counters";
import {UserData} from "../../src/shared/User";

const validateSingleSignup = async (userId: string, etiEventId: string) => {
  const signupRef = db.collection("signups");
  const signup = await signupRef
      .where("userId", "==", userId)
      .where("etiEventId", "==", etiEventId)
      .get();
  if (!signup.empty) {
    const signUpData = signup.docs[0].data();
    throw new functions.https.HttpsError(
        "already-exists",
        "You are already signed up for this event",
        {signUpId: signup.docs[0].id, receipt: signUpData.receipt}
    );
  }
};

async function validateSignupIsOpen(etiEventId: string) {
  const eventRef = db.doc(`events/${etiEventId}`);
  const event = await eventRef.get();

  if (event.data()?.dateSignupOpen.toDate().getTime() > new Date().getTime()) {
    throw new functions.https.HttpsError(
        "failed-precondition", "Signups haven't opened yet");
  }
}

function getUserIdOrFail(context: CallableContext) {
  const userId = context.auth?.uid;
  if (!userId) {
    throw new functions.https.HttpsError(
        "failed-precondition", "createSignup: missing Auth/uid");
  }
  return userId;
}

export const createSignup = functions.https.onCall(
    async (data: SignupCreate, context: CallableContext) => {
      await validateUserIsLoggedIn(context);
      const userId = getUserIdOrFail(context);
      return db.runTransaction(async (transaction) => {
        await validateSignupIsOpen(data.etiEventId);
        await validateSingleSignup(userId, data.etiEventId);
        const userRef = db.collection("users").doc(userId);
        const user = await userRef.get();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {roles, ...userData} = <UserData>user.data();
        const signupData = {
          ...userData,
          ...data,
          dateArrival: new Date(data.dateArrival),
          dateDeparture: new Date(data.dateDeparture),
        };
        const orderNumber =
          await getIncrement({transaction, counterName: data.etiEventId});
        const docRef = db.collection("signups").doc();
        return transaction.set(docRef, {...signupData, orderNumber});
      });
    }
);

export const validateSignup = functions.https.onCall(
    async (data: { etiEventId: string }, context: CallableContext) => {
      await validateUserIsLoggedIn(context);
      const userId = getUserIdOrFail(context);
      await validateSingleSignup(userId, data.etiEventId);
    }
);
