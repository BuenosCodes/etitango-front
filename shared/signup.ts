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

export interface SignupCreate {
    name: string
    last_name: string,
    email: string,
    dni_number: string,
    status: SignupStatus,
    arrival_date: Date,
    leave_date: Date,
    help_with: SignupHelpWith,
    food: FoodChoices,
    role: DanceRoles,
    is_celiac: boolean,
    vaccinated?: boolean,
    country: string,
    state?: string,
    city?: string
}

export interface SignupDoc extends SignupCreate {
    id: string,
    etiEventId: string
}