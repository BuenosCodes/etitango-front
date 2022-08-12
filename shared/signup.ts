export enum SignupStatus {
    WAITLIST = 'waitlist',
    PENDING = 'pending',
    CONFIRMED = 'confirmed'
}

export enum SignupHelpWith {
    CLEANING = 'cleaning',
    COOKING = 'cooking'
}

export enum Genders {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export enum DanceRoles {
    LEADER = 'leader',
    FOLLOWER = 'follower',
    BOTH = 'both',
}

export enum FoodChoices {
    OMNIVORE = 'omnivore',
    VEGETARIAN = 'vegetarian',
    VEGAN = 'vegan'
}

export interface SignupBase {
    nameFirst: string
    nameLast: string,
    email: string,
    dniNumber: string,
    helpWith: SignupHelpWith,
    food: FoodChoices,
    role?: DanceRoles,
    isCeliac: boolean,
    isVaccinated?: boolean,
    country: string,
    state?: string,
    city?: string
    status?: SignupStatus,
}

export interface SignupCreate extends SignupBase {
    dateArrival: Date,
    dateDeparture: Date,
}

export interface Signup extends SignupBase {
    id: string,
    etiEventId: string,
}