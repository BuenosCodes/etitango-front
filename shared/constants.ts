// PROFILE: USER ----------------------------
export enum Genders {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}

export enum DanceRoles {
    LEADER = "LEADER",
    FOLLOWER = "FOLLOWER",
    BOTH = "BOTH"
}

export enum FoodOptions {
    OMNIVORE = "OMNIVORE",
    VEGETARIAN = "VEGETARIAN",
    VEGAN = "VEGAN",
    CELIAC = "CELIAC"
}

export enum BankAccountOptions {
    WIRING_NUMBER = "WIRING_NUMBER",
    ALIAS = "ALIAS"
}


// COMISSION CONTACT WITH -------------------------------
export enum ComissionOptions {
    ACCOUNTANT = "ACCOUNTANT",
    DJ = "DJ",
    EX_ORGANIZERS = "EX_ORGANIZERS"
}


// GENDER COMPLAINT: ADMIN --------------------------
export enum GenderComplaintStatusOptions {
    CLOSED = "CLOSED",
    OPEN = "OPEN"
}

export enum GenderComissionActionOptions {
    BAN = "BAN",
    NOTIFICATION = "NOTIFICATION",
    NONE = "NONE"
}

export enum GenderComplaintBanOptions {
    EXPELLED = "EXPELLED",
    MONTHS = "MONTHS",
    ETI_BAN_NUMBER = "ETI_BAN_NUMBER"
}

// ETI EVENT SING IN: USER -------------------------
export enum TransportOptions {
    CAR = "CAR",
    AIRPLANE = "AIRPLANE",
    BUS = "BUS"
}

export enum CollaborationDayOptions {
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

export enum CollaborationShiftOptions {
    MORNING = "MORNING",
    AFTERNOON = "AFTERNOON",
    NIGHT = "NIGHT"
}

export enum CollaborationDutyOptions {
    BAR = "BAR",
    CLEANING = "CLEANING"
}

export enum TShirtSizeOptions {
    XS = "XS",
    S = "S",
    M = "M",
    L = "L",
    XL = "XL",
    XXL = "XXL"
}

// ETI EVENT SING IN: ADMIN -------------------------
export enum EventSignUpStatus {
    RECEIPT_MISSING = "RECEIPT_MISSING",
    CONFIRMATION_WAITING = "CONFIRMATION_WAITING",
    REGISTERED = "REGISTERED",
    WAITING_LIST = "WAITING_LIST",
    REFUND_REQUEST = "REFUND_REQUEST",
    CANCELLED = "CANCELLED"
}


// ETI EVENT PROPOSAL: ADMIN ------------------------
export enum BudgetCategory {
    PLACE_AND_FURNITURE = "PLACE_AND_FURNITURE",
    INSURANCE = "INSURANCE",
    TAXES = "TAXES",
    ASADETI = "ASADETI",
    EXTRA = "EXTRA"
}

export enum InscriptionMethods {
    LOTTERY = "LOTTERY",
    PAY_ORDER = "PAY_ORDER"
}