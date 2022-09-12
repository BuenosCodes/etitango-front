import {
    DanceRoles, TransportOptions, CollaborationDayOptions,
    CollaborationShiftOptions, CollaborationDutyOptions,
    EventSignUpStatus, Genders, TShirtSizeOptions
} from "./constants";

interface EventPreRegistration {
    userId: string;
    transport: TransportOptions;
    isTransportShare: boolean;
    transportSharePlaces: number;
    dateArrival: Date;
    dateDeparture: Date;
    collaborationDay: CollaborationDayOptions;
    collaborationShift: CollaborationShiftOptions;
    colllaborationDuty: CollaborationDutyOptions;
    isDJ: boolean;
    rolePreference: DanceRoles;  /** view dafault lo de user */

}

interface Child {
    isChild: boolean;
    childFirstName: string;
    childLastName: string;
    childId: number;
    childBirthDate: Date;
}

interface EventRegistration {
    userId: string;
    etiId: string;
    etiPaymentReceipt: string;
    etiChildPaymentReceipt: string;
    etiRegistrationStatus: EventSignUpStatus;

}

interface EtiEvent {
    userId: string;
    etiEventId: string;
    tshirtGender: Genders;
    tshirtSize: TShirtSizeOptions;
    tshirtTransferReceipt: URL;
    tshirtUserId: string;
    isRefund: boolean;
    isDonate: boolean;
}