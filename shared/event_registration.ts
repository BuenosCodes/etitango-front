export enum TransportOptions{
CAR = "AUTO",
AIRPLANE = "AVION",
BUS = "BUS"
}

export enum CollaborationDayOptions{
FRIDAY = "VIERNES",
SATURDAY = "SABADO",
SUNDAY = "DOMINGO"
}

export enum CollaborationShiftOptions{
MORNING = "MANANA",
AFTERNOON = "TARDE",
NIGHT = "NOCHE"
} 

export enum ColllaborationDutyOptions{
BAR = "BARRA",
CLEANING = "LIMPIEZA"
}

export enum TShirtGenderOptions{
MALE = "HOMBRE",
FEMALE = "MUJER"
}

export enum TShirtSizeOptions{
XS ="XS",
S = "S",
M = "M",
L = "L",
XL = "XL",
XXL = "XXL"
}

export enum RegistrationStatusOptions{
RECEIPTMISS = "ADEUDA_SUBIR_COMPROBANTE",
CONFIRMATIONWAITING = "A_ESPERA_DE_CONFIRMACION",
REGISTERED = "INSCRIPTO",
WAITINGLIST = "LISTA_DE_ESPERA",
REFUNDREQUEST = "DEVOLUCION SOLICITADA",
CANCELLED = "CANCELADO"
}

interface EventPreRegistration {
    userId:string;
    transport: TransportOptions;
    transportShare: boolean;
    transportSharePlaces: number;
    dateArrival: Date;
    dateDeparture: Date;
    collaborationDay: CollaborationDayOptions;
    collaborationShift: CollaborationShiftOptions;
    colllaborationDuty: ColllaborationDutyOptions;
    DJ: boolean;
    rolePreference: RoleOptions;  /** view dafault lo de user */
    child: boolean;
    childFirstName: string;
    childLastName: string;
    childId: number;
    childBirthDate: Date;
}

interface EventRegistration {
    userId:string;
    etiId: string;
    etiPaymentReceipt: string;
    etiChildPaymentReceipt: string;
    etiRegistrationStatus: RegistrationStatusOptions;

}

interface MyEvent {
    userId:string;
    etiEventId: string;
    tshirtGender: TShirtGenderOptions;
    tshirtSize: TShirtSizeOptions;
    tshirtTransferReceipt: URL;
    tshirtUserId: string;
    refund: boolean;
    donate: boolean;
}