export interface EtiEventBase {
  id: string;
  name: string;
  location: string;
}

export interface EtiEvent extends EtiEventBase {
  dateStart: Date;
  dateEnd: Date;
}
