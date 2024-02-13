/* eslint-disable no-unused-vars*/
import { Timestamp } from 'firebase/firestore';

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

export interface SignupBase {
  userId: string;
  etiEventId: string;
  nameFirst: string;
  nameLast: string;
  email: string;
  dniNumber: string;
  helpWith: SignupHelpWith;
  food: FoodChoices;
  role?: DanceRoles;
  isCeliac: boolean;
  isVaccinated?: boolean;
  country: string;
  province?: string;
  city?: string;
  status?: SignupStatus;
  didAttend: boolean;
  receipt?: string;
  orderNumber: number;
  disability?: string;
  phoneNumber: string;
}

export interface SignupCreate extends SignupBase {
  dateArrival: Date;
  dateDeparture: Date;
}

export interface Signup extends SignupBase {
  id: string;
  dateArrival: Date;
  dateDeparture: Date;
  lastModifiedAt: Date;
}

export interface SignupFirestore extends SignupBase {
  id: string;
  dateArrival: Timestamp;
  dateDeparture: Timestamp;
  lastModifiedAt: Timestamp;
}
