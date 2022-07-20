import * as functions from "firebase-functions";
import {CallableContext} from "firebase-functions/lib/common/providers/https";
import {db} from "./index";

export const createUserInDB = functions.https.onCall(async (data: {email: string}, context: CallableContext) => {
    if (!context.auth || !context.auth.uid) {
        throw new functions.https.HttpsError("unauthenticated", 'The function must be called with a logged in user');
    }
    const {email} = data;
    const ref = db.collection('users').doc(context.auth.uid);
    await ref.set({email});
});
