import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db, storage } from '../../etiFirebase';
import { EtiEvent, EtiEventFirestore, priceScheduleToJs } from '../../shared/etiEvent';
import { createOrUpdateDoc, getCollection, getDocument } from './index';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export const EVENTS = 'events';

const toJs = (etiEventFromFirestore: EtiEventFirestore) =>
  ({
    ...etiEventFromFirestore,
    dateStart: etiEventFromFirestore?.dateStart?.toDate(),
    dateEnd: etiEventFromFirestore?.dateEnd?.toDate(),
    dateSignupOpen: etiEventFromFirestore?.dateSignupOpen?.toDate(),
    prices: priceScheduleToJs(etiEventFromFirestore?.prices || [])
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
  return toJs({ ...doc, id });
}

export async function getEvents() {
  const events = (await getCollection(EVENTS)) as EtiEventFirestore[];
  return events.map(toJs);
}

export async function uploadEventImage(eventId: string, file: File) {
  const ALLOWED_RECEIPT_FILE_TYPES = ['image/jpeg', 'image/png'];
  if (!ALLOWED_RECEIPT_FILE_TYPES.includes(file.type)) {
    throw new Error('Invalid file extension');
  }
  const fileExtension = file.name.split('.').pop();
  // eslint-disable-next-line no-undef
  const storageRef = ref(storage, `events/current.${fileExtension}`);
  const uploadFileTask = await uploadBytesResumable(storageRef, file);
  const fileUrl = await getDownloadURL(uploadFileTask.ref);
  await createOrUpdateDoc(EVENTS, { image: fileUrl }, eventId);
  return fileUrl;
}
