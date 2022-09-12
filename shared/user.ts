import { BankAccountOptions, Genders, FoodOptions, DanceRoles, ComissionOptions } from "./constants"

interface UserProfilePersonal {
    id: string;
    nameFirst: string;
    nameLast: string;
    documentNumber: number;
    cellPhone: number;
    birthDate: Date;
    country: string;
    province?: string;
    city?: string;
    bankAccount: string;
    bankAccountType: BankAccountOptions;
    gender: Genders;
    foodPreference: FoodOptions;
    rolePreference: DanceRoles;
}


interface UserComissionContact {
    id: string;
    userId: string;
    comission: ComissionOptions;
    comissionMessage: string;
}

interface UserBugReport {
    id: string;
    userId: string;
    bugMessage: string;
}