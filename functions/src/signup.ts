import * as functions from "firebase-functions";
import {CallableContext} from "firebase-functions/lib/providers/https";
import {db} from "./index";
import {validateUserIsLoggedIn} from "./validators";
import {SignupCreate} from "../../src/shared/signup";
import {getIncrement} from "./counters";

const validateSingleSignup = async (userId: string, etiEventId: string) => {
  const signupRef = db.collection("signups");
  const signup = await signupRef
      .where("userId", "==", userId)
      .where("etiEventId", "==", etiEventId).get();
  if (!signup.empty) {
    throw new functions.https.HttpsError(
        "already-exists",
        "You are already signed up for this event"
    );
  }
};

export const createSignup = functions.https.onCall(
    async (data: SignupCreate, context: CallableContext) => {
      await validateUserIsLoggedIn(context);
      const userId = context.auth!.uid;
      return db.runTransaction(async (transaction) => {
        await validateSingleSignup(userId, data.etiEventId);
        const userRef = db.collection("users").doc(userId);
        const user = await userRef.get();
        const signupData = {
          ...user.data(),
          ...data,
          dateArrival: new Date(data.dateArrival),
          dateDeparture: new Date(data.dateDeparture),
        };
        const orderNumber = await getIncrement(
            {transaction, counterName: data.etiEventId});
        const signupsRef = db.collection("signups");
        return signupsRef.add({...signupData, orderNumber});
      });
    }
);
