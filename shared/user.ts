export enum BankAccountOptions {
WIRING= 'CBU',
ALIAS= "ALIAS"
}

export enum GenderOptions {
MALE = "HOMBRE",
FEMALE = "MUJER",
OTHER = "OTR@"
}

export enum FoodOptions {
OMNIVORE = "OMNIVORO",  
VEGETARIAN = "VEGETARIANO",
CELIAC = "CELIACO"
}

export enum RoleOptions {
FOLLOWER = "GUID@",
LEADER "LIDER"
}

export enum ComissionOptions {
ACCOUNTANT = "CONTABLE",
TDJ = "MUSICALIZADORES",
EXORGANIZERS = "EX-ORGANIZADORES"
}


interface UserProfilePersonal {
    id:string;
    nameFirst: string;
    nameLast: string;
    documentNumber: number;
    cellPhone: number;
    birthDate: Date;
    country: string;
    province: string;
    city: string;
    bankAccount: string;
    bankAccountType: BankAccountOptions;
    gender: GenderOptions;
    foodPreference: FoodOptions;
    rolePreference: RoleOptions;
}


interface UserComissionContact {
    id: string;
    userId:string;
    comission: ComissionOptions;
    comissionMessage: string;
}

interface UserBugReport {
    id:string;
    userId:string;
    bugMessage: string;
}