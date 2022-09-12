import { EventSignUpStatus, DanceRoles, FoodOptions, CollaborationDutyOptions } from "./constants"

export interface SignupCreate {
    name: string
    lastname: string,
    email: string,
    dninumber: string,
    status: EventSignUpStatus,
    arrivaldate: Date,
    leaveDate: Date,
    collaborationDuties: CollaborationDutyOptions,
    food: FoodOptions,
    role: DanceRoles,
    isCeliac: boolean,
    country: string,
    state?: string,
    city?: string
}

export interface SignupDoc extends SignupCreate {
    id: string,
    etiEventId: string
}