/* eslint-disable no-unused-vars*/
import { Timestamp } from 'firebase/firestore';
import { UserData } from './User';

export enum SignupStatus {
  WAITLIST = 'waitlist',
  PAYMENT_PENDING = 'payment-pending',
  PAYMENT_TO_CONFIRM = 'payment-to-confirm',
  PAYMENT_DELAYED = 'payment-delayed',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  FLAGGED = 'flagged'
}

export enum SignupHelpWith {
  CLEANING = 'cleaning',
  COOKING = 'cooking',
  BAR = 'bar'
}

export enum Genders {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum DanceRoles {
  LEADER = 'leader',
  FOLLOWER = 'follower',
  BOTH = 'both'
}

export enum FoodChoices {
  OMNIVORE = 'omnivore',
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan'
}

export type SignupFormData = {
  dateArrival: Date;
  dateDeparture: Date;
  helpWith: SignupHelpWith;
  food: FoodChoices;
  isCeliac: boolean;
  country: string;
  province?: string;
  city?: string;
  wantsLodging?: boolean;
};

export interface StatusHistory {
  status: SignupStatus;
  date: Date;
}

type StatusHistoryFirestore = Omit<StatusHistory, 'date'> & { date: Timestamp };

// eslint-disable-next-line no-undef
export type Signup = SignupFormData &
  Omit<UserData, 'lastModifiedAt'> & {

    id: string;
    etiEventId: string;
    status: SignupStatus;
    didAttend: boolean;
    receipt?: string;
    orderNumber: number;
    lastModifiedAt: Date;
    statusHistory?: StatusHistory[];
    dateArrival: Date;
    dateDeparture: Date;
    userId: string;
  };

export type SignupFirestore = Omit<
  Signup,
  'dateArrival' | 'dateDeparture' | 'lastModifiedAt' | 'statusHistory'
> & {
  dateArrival: Timestamp;
  dateDeparture: Timestamp;
  lastModifiedAt: Timestamp;
  statusHistory: StatusHistoryFirestore[];
};
