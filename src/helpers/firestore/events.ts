/* eslint-disable prettier/prettier */
import { collection, getDocs, limit, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { db } from '../../etiFirebase';
import { EtiEvent, EtiEventBase } from '../../shared/etiEvent';
import { getCollection, getDocument } from './index';

export const EVENTS = 'events';

interface EtiEventFirestore extends EtiEventBase {
  dateStart: Timestamp;
  dateEnd: Timestamp;
  dateSignupOpen: Timestamp;
  dateSignupEnd: Timestamp;
  firstDatePay: Timestamp;
  secondDatePay: Timestamp;
  refundDeadline: Timestamp;
}

const toJs = (etiEventFromFirestore: EtiEventFirestore) =>
  ({
    ...etiEventFromFirestore,
    dateStart: etiEventFromFirestore?.dateStart?.toDate(),
    dateEnd: etiEventFromFirestore?.dateEnd?.toDate(),
    dateSignupOpen: etiEventFromFirestore?.dateSignupOpen?.toDate(),
    dateSignupEnd: etiEventFromFirestore?.dateSignupEnd?.toDate(),
    firstDatePay: etiEventFromFirestore?.firstDatePay instanceof Timestamp ? etiEventFromFirestore?.firstDatePay?.toDate() : null,
    secondDatePay: etiEventFromFirestore?.secondDatePay instanceof Timestamp ? etiEventFromFirestore?.secondDatePay?.toDate() : null,
    refundDeadline: etiEventFromFirestore?.refundDeadline instanceof Timestamp ? etiEventFromFirestore?.refundDeadline?.toDate() : null,
  } as EtiEvent);

export async function getFutureEti() {
  const ref = collection(db, EVENTS);
  const q = query(ref, where('dateEnd', '>', new Date()), orderBy('dateEnd', 'asc'), limit(1));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))[0] as EtiEventFirestore;
  return toJs(data);
}

export async function getEvent(id: string) {
  const doc = (await getDocument(`${EVENTS}/${id}`)) as EtiEventFirestore;
  return toJs(doc);
}
export async function getEvents() {
  const events = (await getCollection(EVENTS)) as EtiEventFirestore[];
  return events.map(toJs);
}
