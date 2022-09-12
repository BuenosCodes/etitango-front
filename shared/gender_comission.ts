import { GenderComissionActionOptions, GenderComplaintBanOptions } from "./constants";

interface GenderComplaint {
    genderComissionAction: GenderComissionActionOptions;
    genderComplaintLastReview: Date;
    genderComplaintLastReviewer: string;
    genderComplaintBan: GenderComplaintBanOptions;  //SI EXPULSADO entonces flag a lista negra
    genderComplaintBanAction: number;
    genderComissionVeredict: string;
    genderComissionInternalComment: string;
}