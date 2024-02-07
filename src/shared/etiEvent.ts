export interface EtiEventBase {
  id: string;
  name: string;
  location: string;
  admins: string[];
  capacity: number;
  daysBeforeExpiration: number;
}

export interface EtiEvent extends EtiEventBase {
  dateStart: Date;
  dateEnd: Date;
  dateSignupOpen: Date;
}
