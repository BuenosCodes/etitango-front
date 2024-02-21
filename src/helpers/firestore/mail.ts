import { getCollection } from './index';
import { collection, getDocs, query, Timestamp, where } from 'firebase/firestore';
import { db } from '../../etiFirebase';
import { flatten } from 'flat';

export const MAIL = 'mail';

interface SentMailBase {
  id: string;
  template: {
    eventId: string;
    data: {
      userName: string;
    };
    name: string;
  };
  to: string[];
  signupId: string;
  delivery: {
    leaseExpireTime: string | null;
    state: string;
    error: string;
    attempts: number;
  };
}

interface SentMailFirestore extends SentMailBase {
  // Extending the 'delivery' property to include 'startTime' and retaining 'state'
  delivery: {
    leaseExpireTime: string | null;
    startTime: Timestamp;
    state: string;
    endTime: Timestamp;
    error: string;
    attempts: number;
  };
}

export interface SentMail extends SentMailBase {
  delivery: {
    leaseExpireTime: string | null;
    startTime: Date;
    state: string;
    endTime: Date;
    error: string;
    attempts: number;
  };
}

export interface SentMailSummary {
  id: string;
  eventId: string;
  userName: string;
  name: string;
  to: string[];
  signupId: string;
  leaseExpireTime: string | null;
  state: string;
  error: string;
  attempts: number;
  startTime: Date;
  endTime: Date;
}

export async function getMails() {
  const events = (await getCollection(MAIL)) as SentMailFirestore[];
  return events.map(toJs) as SentMail[];
}

export async function getMailsForEvent(eventId: string, userEmail?: string | null) {
  const ref = collection(db, MAIL);
  const eventFilter = where('template.eventId', '==', eventId);
  const q = userEmail
    ? query(ref, eventFilter, where('to', 'array-contains', userEmail))
    : query(ref, eventFilter);
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as SentMailFirestore[];
  return data.map(toJs);
}

const toJs = ({ delivery, ...sentMailFirestore }: SentMailFirestore) =>
  ({
    ...sentMailFirestore,
    delivery: {
      ...delivery,
      startTime: delivery?.startTime?.toDate(),
      endTime: delivery?.endTime?.toDate()
    }
  } as SentMail);

export const flat = (emails: SentMail[]) => {
  return emails.map((e: SentMail) => flatten(e));
};
