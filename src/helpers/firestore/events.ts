import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { storage } from '../../etiFirebase';
import { EtiEvent, EtiEventFirestore, priceScheduleToJs } from '../../shared/etiEvent';
import { createOrUpdateDoc, getCollection, getDocument } from './index';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { mockFirestore } from '../../__mocks__';

export const EVENTS = 'events';

const toJs = (etiEventFromFirestore: EtiEventFirestore) =>
  ({
    ...etiEventFromFirestore,
    dateStart: etiEventFromFirestore?.dateStart?.toDate(),
    dateEnd: etiEventFromFirestore?.dateEnd?.toDate(),
    dateSignupOpen: etiEventFromFirestore?.dateSignupOpen?.toDate(),
    prices: priceScheduleToJs(etiEventFromFirestore?.prices || []),
    comboReturnDeadline: etiEventFromFirestore?.comboReturnDeadline?.toDate()
  } as EtiEvent);

export async function getFutureEti() {
  const ref = collection(mockFirestore, EVENTS);
  const q = query(ref, where('dateStart', '>', new Date()), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  return toJs(snapshot.docs[0].data() as EtiEventFirestore);
}

export async function getEvent(id: string) {
  const doc = (await getDocument(`${EVENTS}/${id}`)) as EtiEventFirestore;
  return toJs({ ...doc, id });
}

export async function getEvents() {
  const ref = collection(mockFirestore, EVENTS);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(doc => toJs(doc.data() as EtiEventFirestore));
}

export async function updateEvent(event: EtiEvent) {
  const ref = doc(mockFirestore, EVENTS, event.id);
  await updateDoc(ref, {
    ...event,
    dateStart: Timestamp.fromDate(event.dateStart),
    dateEnd: Timestamp.fromDate(event.dateEnd),
    dateSignupOpen: Timestamp.fromDate(event.dateSignupOpen),
    comboReturnDeadline: event.comboReturnDeadline ? Timestamp.fromDate(event.comboReturnDeadline) : null
  });
  return true;
}

export async function uploadEventImage(eventId: string, file: File) {
  const ALLOWED_RECEIPT_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!ALLOWED_RECEIPT_FILE_TYPES.includes(file.type)) {
    throw new Error('Invalid file extension');
  }
  const fileExtension = file.name.split('.').pop();
  // eslint-disable-next-line no-undef
  const storageRef = ref(storage, `events/${eventId}.${fileExtension}`);
  const uploadFileTask = await uploadBytesResumable(storageRef, file);
  const fileUrl = await getDownloadURL(uploadFileTask.ref);
  await createOrUpdateDoc(EVENTS, { image: fileUrl }, eventId);
  return fileUrl;
}

export const getEventLive = async (
  etiEventId: string,
  setEvent: Function,
  setIsLoading: Function
) => {
  setIsLoading(true);
  return onSnapshot(doc(mockFirestore, EVENTS, etiEventId), (doc) => {
    const data = { ...doc.data(), id: etiEventId } as EtiEventFirestore;
    setEvent(toJs(data));
    setIsLoading(false);
  });
};
