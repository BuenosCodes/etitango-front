import { SetStateAction } from "react";

/* eslint-disable prettier/prettier */
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
  combos: ["Dos Milongas", "Asamblea Etiana", "Comida de despedida"]
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
  hora: Date;
  agenda: string[];
  dateSignupEnd: Date;
  alojamiento: string[];
  datosBancarios: string[];
  linkMercadoPago: string[];
}