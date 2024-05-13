import { Timestamp } from 'firebase/firestore';

export interface EtiEventBase {
  id: string;
  image: string;
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
  landingTitle: string;
  comboReturnDeadlineHuman: string;
}

export interface EtiEvent extends EtiEventBase {
  dateStart: Date;
  dateEnd: Date;
  dateSignupOpen: Date;
  comboReturnDeadline: Date;
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
  comboReturnDeadline: Timestamp;
  prices: PriceScheduleFirebase[];
}

export const priceScheduleToJs = (priceSchedule: PriceScheduleFirebase[]) =>
  priceSchedule.map(({ deadline, ...rest }) => ({
    ...rest,
    deadline: deadline.toDate()
  }));
