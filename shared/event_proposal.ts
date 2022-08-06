export enum BudgetCategory{
PLACEANDFURNITURE = "SALON_Y_MOBILIARIOS",
INSURANCE = "SEGUROS",
TAXES = "IMPUESTOS_FIJOS",
ASADETI = "ASADETI",
EXTRA = "GASTOS VARIOS"
} 

export enum InscriptionMethods{
LOTTERY = "SORTEO",
PAYORDER = "ORDEN DE PAGO"
} 

export interface ProposalItem {
    Id: string;
    description: string;
    amount: number;
    itemPrice: number;
    totalPrice: number;
    itemType: BudgetCategory;
}

interface PreProposal {
    date: Date;
    country: string;
    province: string;
    city: string;
    maxAttendance: number;
    orginizers: Array<string>;      // Array<userId>
    colaborators: Array<string>;    // Array<userId>
    inscriptionMethod: InscriptionMethods;
}

interface FinalProposal {
    preInscriptionId: string;
    items: Array<ProposalItem>;
    eventValue: number;
}