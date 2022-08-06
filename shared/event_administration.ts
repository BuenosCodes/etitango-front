import {ProposalItem} from "./event_proposal";

export interface AdministrationItem extends ProposalItem {
    receipt: URL;
}

interface RegistrationReview {
    registrationId: string;
    paymentDate: Date;
    paymentNumber: number;
    confirmed: boolean;
}

interface EventScheduleItem {
    description: string;
    date: Date;
}

interface Orchestra {
    name: string;
    date: Date;
}

interface Lodging {
    name: string;
    address: string;
    phones: Array<string>;
    mails: Array<string>;
    mapsLocation: Geolocation;
}

interface AdministrationBankAccount {
    alias: string;
    cbu: string;
    owner: string;
}

interface AdministrationTShirt {
    myEventId: string;
}