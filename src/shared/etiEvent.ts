import { Timestamp } from 'firebase/firestore';

export interface EtiEventBase {
  id: string;
  name: string;
  location: string;
  admins: string[];
  capacity: number;
  daysBeforeExpiration: number;
  bank: {
    entity: string;
    holder: string;
    cbu: string;
    alias: string;
    cuit: string;
  };
  schedule: { title: string; activities: string }[];
  locations: { name: ''; link: '' }[];
}

export interface EtiEvent extends EtiEventBase {
  dateStart: Date;
  dateEnd: Date;
  dateSignupOpen: Date;
  prices: PriceSchedule[];
}

export interface PriceSchedule {
  deadlineHuman: string;
  priceHuman?: string; // only in the templates
  deadline: Date;
  price: number;
}

export type PriceScheduleFirebase = Omit<PriceSchedule, 'deadline'> & {
  deadline: Timestamp;
};

export interface EtiEventFirestore extends EtiEventBase {
  dateStart: Timestamp;
  dateEnd: Timestamp;
  dateSignupOpen: Timestamp;
  prices: PriceScheduleFirebase[];
}

export const priceScheduleToJs = (priceSchedule: PriceScheduleFirebase[]) =>
  priceSchedule.map(({ deadline, price }) => ({
    price,
    deadline: deadline.toDate()
  }));
