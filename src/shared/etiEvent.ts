import { SetStateAction } from 'react';

export interface EtiEventBase {
  id: string;
  name: string;
  location: string;
  country: string;
  province: string;
  city: string;
  timeStart: string;
  timeEnd: string;
  timeSignupOpen: string;
  timeSignupEnd: string;
  firstPay: string;
  firstTimePay: string;
  secondPay: string;
  secondTimePay: string;
  timeRefundDeadline: string;
  limitParticipants: string;
  admins: [];
  combos: [];
}

export interface EtiEvent extends EtiEventBase {
  imageUrl: SetStateAction<string>;
  dateStart: Date;
  dateEnd: Date;
  dateSignupOpen: Date;
  firstDatePay: Date;
  secondDatePay: Date;
  refundDeadline: Date;
  description: string;
  hour: Date;
  calendar: string[];
  dateSignupEnd: Date;
  host: string[];
  bankData: string[];
  mercadoPagoLink: string[];
  capacity: number;
}
