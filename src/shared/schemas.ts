import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

// Common validation rules
const urlSchema = z.string().url('Invalid URL format');
const positiveNumberSchema = z.number().positive('Capacity must be positive');
const nonEmptyStringSchema = z.string().min(1, 'Field cannot be empty');
const phoneNumberSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');
const dniSchema = z.string().regex(/^\d{7,8}$/, 'DNI must be 7 or 8 digits');

// Enums
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

// Base schemas for common fields
const baseUserSchema = z.object({
  city: z.string().optional(),
  country: nonEmptyStringSchema,
  dniNumber: dniSchema,
  email: z.string().email('Invalid email address'),
  food: z.nativeEnum(FoodChoices),
  isCeliac: z.boolean(),
  nameFirst: nonEmptyStringSchema,
  nameLast: nonEmptyStringSchema,
  province: z.string().optional(),
  phoneNumber: phoneNumberSchema,
  disability: nonEmptyStringSchema,
  gender: z.nativeEnum(Genders),
  danceRole: z.nativeEnum(DanceRoles),
});

const baseEventSchema = z.object({
  id: nonEmptyStringSchema,
  image: urlSchema,
  name: nonEmptyStringSchema,
  location: nonEmptyStringSchema,
  admins: z.array(nonEmptyStringSchema).min(1, 'At least one admin is required'),
  capacity: positiveNumberSchema,
  daysBeforeExpiration: positiveNumberSchema,
  bank: z.object({
    entity: nonEmptyStringSchema,
    holder: nonEmptyStringSchema,
    cbu: z.string().regex(/^\d{22}$/, 'CBU must be 22 digits'),
    alias: z.string().regex(/^[a-zA-Z0-9\.]+$/, 'Invalid alias format'),
    cuit: z.string().regex(/^\d{11}$/, 'CUIT must be 11 digits'),
  }),
  schedule: z.array(z.object({
    title: nonEmptyStringSchema,
    activities: nonEmptyStringSchema,
  })).min(1, 'At least one schedule entry is required'),
  locations: z.array(z.object({
    name: nonEmptyStringSchema,
    link: urlSchema,
  })).min(1, 'At least one location is required'),
  landingTitle: nonEmptyStringSchema,
  comboReturnDeadlineHuman: nonEmptyStringSchema,
  lodgingCapacity: positiveNumberSchema,
});

// Date handling schemas
const dateSchema = z.date().refine(
  (date) => !isNaN(date.getTime()),
  'Invalid date'
);

const timestampSchema = z.instanceof(Timestamp);

// Price schedule schemas
const basePriceScheduleSchema = z.object({
  deadlineHuman: nonEmptyStringSchema,
  priceHuman: z.string().optional(),
  deadline: dateSchema,
  price: positiveNumberSchema,
});

const priceScheduleSchema = basePriceScheduleSchema.refine(
  (data) => {
    if (data.priceHuman) {
      return /^\d+(\.\d{2})?$/.test(data.priceHuman);
    }
    return true;
  },
  'Price format must be a number with up to 2 decimal places'
);

const priceScheduleFirestoreSchema = basePriceScheduleSchema.extend({
  deadline: timestampSchema,
}).refine(
  (data) => {
    if (data.priceHuman) {
      return /^\d+(\.\d{2})?$/.test(data.priceHuman);
    }
    return true;
  },
  'Price format must be a number with up to 2 decimal places'
);

// Event schemas
export const etiEventSchema = baseEventSchema.extend({
  dateStart: dateSchema,
  dateEnd: dateSchema,
  dateSignupOpen: dateSchema,
  comboReturnDeadline: dateSchema,
  prices: z.array(priceScheduleSchema).min(1, 'At least one price schedule is required'),
}).refine(
  (data) => data.dateEnd > data.dateStart,
  'End date must be after start date'
).refine(
  (data) => data.dateSignupOpen <= data.dateStart,
  'Signup must open before or at event start'
).refine(
  (data) => data.comboReturnDeadline <= data.dateStart,
  'Combo return deadline must be before or at event start'
).refine(
  (data) => data.lodgingCapacity <= data.capacity,
  'Lodging capacity cannot exceed total capacity'
);

export const etiEventFirestoreSchema = baseEventSchema.extend({
  dateStart: timestampSchema,
  dateEnd: timestampSchema,
  dateSignupOpen: timestampSchema,
  comboReturnDeadline: timestampSchema,
  prices: z.array(priceScheduleFirestoreSchema).min(1, 'At least one price schedule is required'),
});

// Signup schemas
export const signupSchema = z.object({
  dateArrival: dateSchema,
  dateDeparture: dateSchema,
  helpWith: z.nativeEnum(SignupHelpWith),
  food: z.nativeEnum(FoodChoices),
  isCeliac: z.boolean(),
  country: nonEmptyStringSchema,
  province: z.string().optional(),
  city: z.string().optional(),
  wantsLodging: z.boolean().optional(),
}).refine(
  (data) => data.dateDeparture > data.dateArrival,
  'Departure date must be after arrival date'
);

// User schemas
export const userSchema = baseUserSchema.extend({
  roles: z.record(z.boolean()).optional(),
  adminOf: z.array(nonEmptyStringSchema).default([]),
  lastModifiedAt: dateSchema,
});

export const userFirestoreSchema = userSchema.extend({
  lastModifiedAt: timestampSchema,
});

// Export types derived from schemas
export type EtiEvent = z.infer<typeof etiEventSchema>;
export type EtiEventFirestore = z.infer<typeof etiEventFirestoreSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type PriceSchedule = z.infer<typeof priceScheduleSchema>;
export type PriceScheduleFirestore = z.infer<typeof priceScheduleFirestoreSchema>;
export type User = z.infer<typeof userSchema>;
export type UserFirestore = z.infer<typeof userFirestoreSchema>;

// Utility functions for conversion
export const toFirestore = {
  priceSchedule: (data: PriceSchedule): PriceScheduleFirestore => ({
    ...data,
    deadline: Timestamp.fromDate(data.deadline),
  }),
  etiEvent: (data: EtiEvent): EtiEventFirestore => ({
    ...data,
    dateStart: Timestamp.fromDate(data.dateStart),
    dateEnd: Timestamp.fromDate(data.dateEnd),
    dateSignupOpen: Timestamp.fromDate(data.dateSignupOpen),
    comboReturnDeadline: Timestamp.fromDate(data.comboReturnDeadline),
    prices: data.prices.map(toFirestore.priceSchedule),
  }),
  user: (data: User): UserFirestore => ({
    ...data,
    lastModifiedAt: Timestamp.fromDate(data.lastModifiedAt),
  }),
};

export const fromFirestore = {
  priceSchedule: (data: PriceScheduleFirestore): PriceSchedule => ({
    ...data,
    deadline: data.deadline.toDate(),
  }),
  etiEvent: (data: EtiEventFirestore): EtiEvent => ({
    ...data,
    dateStart: data.dateStart.toDate(),
    dateEnd: data.dateEnd.toDate(),
    dateSignupOpen: data.dateSignupOpen.toDate(),
    comboReturnDeadline: data.comboReturnDeadline.toDate(),
    prices: data.prices.map(fromFirestore.priceSchedule),
  }),
  user: (data: UserFirestore): User => ({
    ...data,
    lastModifiedAt: data.lastModifiedAt.toDate(),
  }),
}; 