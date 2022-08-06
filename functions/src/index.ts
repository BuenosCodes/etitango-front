import * as functions from "firebase-functions";
import {CallableContext} from "firebase-functions/lib/common/providers/https";
import {SampleInterface} from "../../shared/example";
const {initializeApp, applicationDefault,} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');


initializeApp({credential: applicationDefault(),});

export const db = getFirestore();

export const helloWorld = functions.https.onCall(async (data: SampleInterface, context: CallableContext) => {
    const txt = "Hello from Firebase!";
    return {txt: txt + ' ' + data.fieldA};
});

export const authentication = require('./authentication');