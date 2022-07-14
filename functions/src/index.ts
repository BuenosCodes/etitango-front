import * as functions from "firebase-functions";
import {CallableContext} from "firebase-functions/lib/common/providers/https";

const admin = require('firebase-admin');
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onCall((data: any, context: CallableContext) => {
    const txt = "Hello from Firebase!";
    return {txt: txt + ' ' + data.text};
});
