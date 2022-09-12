import { GenderComplaintStatusOptions } from "./constants";

interface GenderComplaint {
    isGenderComplaint: boolean;
    genderComplaintLocation: string;
    genderComplaintETI: string; /** misma variable que el listado de etis */
    genderComplaintVictimName: string;
    genderComplaintDescription: string;
    genderComplaintWill: string;
    isGenderComplaintContact: boolean;
    isGenderComplaintRestriction: boolean;
    genderComplaintRestrictionFile: URL;
    genderComplaintID: string;
    genderComplaintStatus: GenderComplaintStatusOptions;
}