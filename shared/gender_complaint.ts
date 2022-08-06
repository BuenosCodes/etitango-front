export enum GenderComplaintStatusOptions{
CLOSED = "CERRADA",
OPEN = "SIN ANALIZAR"
}

interface GenderComplaint {
    genderComplaint: boolean;
    genderComplaintLocation: string;
    genderComplaintETI: string; /** misma variable que el listado de etis */
    genderComplaintVictimName: string;
    genderComplaintDescription: string;
    genderComplaintWill: string;
    genderComplaintContact: boolean;
    genderComplaintRestriction: boolean;
    genderComplaintRestrictionFile: URL;
    genderComplaintID: string;
    genderComplaintStatus: GenderComplaintStatusOptions;
}