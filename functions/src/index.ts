import * as functions from "firebase-functions";
import {CallableContext} from "firebase-functions/lib/providers/https";
import {applicationDefault, initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

import {SampleInterface} from "../../src/shared/example";

initializeApp({credential: applicationDefault()});

export const db = getFirestore();

export const helloWorld = functions.https.onCall(
    async (data: SampleInterface, context: CallableContext) => {
      const txt = "Hello from Firebase!";
      return {txt: txt + " " + data.fieldA};
    }
);

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const authentication = require("./authentication");

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const seeds = require("./seeds");

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const mailing = require("./mailing");

export const signup = require("./signup");

export const superAdmin = require("./superAdmin");
