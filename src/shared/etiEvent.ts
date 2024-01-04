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
  admins: [];
}

export interface EtiEvent extends EtiEventBase {
  imageUrl: SetStateAction<string>;
  dateStart: Date;
  dateEnd: Date;
  dateSignupOpen: Date;
<<<<<<< HEAD
  description: string;
  hora: Date;
  additionalFields: string[];
=======
  dateSignupEnd: Date;
>>>>>>> b5bd151f7e3804e2b2379e85992006ba3da73cfc
}
