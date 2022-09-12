import { BudgetCategory, InscriptionMethods } from "./constants";

export interface ProposalItem {
    id: string;
    description: string;
    amount: number;
    itemPrice: number;
    totalPrice: number;
    BudgetCategory: BudgetCategory;
}

interface PreProposal {
    date: Date;
    country: string;
    province?: string;
    city: string;
    maxAttendance: number;
    organizers: Array<string>;      // Array<userId>
    colaborators: Array<string>;    // Array<userId>
    inscriptionMethod: InscriptionMethods;
}

interface FinalProposal {
    preInscriptionId: string;
    items: Array<ProposalItem>;
    eventValue: number;
}