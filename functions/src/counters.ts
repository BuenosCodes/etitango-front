import * as firebase from "firebase-admin";
import {db} from "./index";

const defaultPath = "Counters";

export interface incrementParams {
  transaction: firebase.firestore.Transaction;
  counterName: string;
  path?: firebase.firestore.CollectionReference;
  startAt?: number;
  incrementValue?: number;
}

export async function getIncrement(args: incrementParams): Promise<number> {
  let result = args.startAt ?? 1;
  const path = args.path ?? defaultPath;
  const counterRef = db.doc(`${path}/${args.counterName}`);

  const counterDoc = await args.transaction.get(counterRef);

  if (counterDoc.exists) {
    console.log(`Counter ${args.counterName} exists`);
    const {counterValue} = counterDoc.data()!;
    result = counterValue + (args.incrementValue ?? 1);
    args.transaction.update(counterRef, {counterValue: result});
  } else {
    const counterValue = result;
    console.log(`Counter ${args.counterName} 
    created with next value ${counterValue}`);
    args.transaction.create(counterRef, {counterValue});
  }

  console.log(`Counter ${args.counterName} result ${result}`);
  return result;
}
