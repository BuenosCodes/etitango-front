import {collection, getDocs, limit, orderBy, query, Timestamp, where} from "firebase/firestore";
import {db} from "../../etiFirebase";
import {EtiEvent} from "../../../shared/etiEvent";

const EVENTS = 'events'

interface EtiEventFirestore {
    id: string;
    name: string;
    location: string;
    dateStart: Timestamp;
    dateEnd: Timestamp;
}

const toJs = (etiEventFromFirestore: EtiEventFirestore) =>
    ({
        ...etiEventFromFirestore, dateStart: etiEventFromFirestore.dateStart.toDate(),
        dateEnd: etiEventFromFirestore.dateEnd.toDate()
    } as EtiEvent)

export async function getFutureEti() {
    const ref = collection(db, EVENTS);
    const q = query(ref,
        where('dateStart', '>', new Date()),
        orderBy("dateStart", 'asc'),
        limit(1));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}))[0] as EtiEventFirestore;
    return toJs(data);
}

