/* eslint-disable prettier/prettier */
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc } from 'firebase/firestore';
import { db } from '../../etiFirebase';

export async function getCollection(path) {
  try {
    const ref = collection(db, path);
    const q = query(ref);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getDocument(path) {
  try {
    const ref = doc(db, path);
    const docSnapshot = await getDoc(ref);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      return undefined;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const createOrUpdateDoc = async (path, data, id) => {
  try {
    const docData = { ...data };
    Object.entries(data).forEach(([k, v]) => {
      if (v === undefined || v === null) delete docData[k];
    });

    if (id) {
      await setDoc(doc(db, `${path}/${id}`), docData, { merge: true });
      return id;
    } else {
      const docRef = await addDoc(collection(db, path), docData);
      return docRef.id;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const updateEventWithImageUrl = async (eventId, imageUrl) => {
  try {
    const event = await getDocument(`events/${eventId}`);

    if(event){
      const updateEventData = {
        ...event,
        imageUrl: imageUrl,
      };

      await setDoc(doc(db, `events/${eventId}`), updateEventData, {merge: true});
      return eventId;
    } else{
      console.log(`no se encontro el evento con ID ${eventId}`);
      return undefined;
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}