import { SetStateAction } from "react";

/* eslint-disable prettier/prettier */
export interface EtiEventBase {
  id: string;
  name: string;
  location: string;
  country: string;
  province: string;
  city: string;
  admins: [];
}

export interface EtiEvent extends EtiEventBase {
  imageUrl: SetStateAction<string>;
  dateStart: Date;
  dateEnd: Date;
  dateSignupOpen: Date;
}
