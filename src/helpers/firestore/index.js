import {addDoc, collection, doc, getDoc, getDocs, query, setDoc} from "firebase/firestore";
import {db} from "../../etiFirebase";


export async function getCollection(path) {
    const ref = collection(db, path);
    const q = query(ref);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
}

export async function getDocument(...path) {
    const ref = doc(db, path);
    const docSnapshot = await getDoc(ref);
    if (docSnapshot.exists()) {
        return docSnapshot.data()
    } else {
        return undefined;
    }
}

export const createDoc = async (path, data, id) => {
    if (!!id) {
        const docRef = await setDoc(doc(db, `${path}/${id}`), data, id);
        return docRef.id
    } else {
        const docRef  = await addDoc(collection(db, path), data);
        return docRef.id;
    }
};