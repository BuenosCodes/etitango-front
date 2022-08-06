export enum GenderComissionActionOptions {
BAN = "se veta al denunciado",
NOTIFICATION = "se notifica al denunciado",
NONE = "no se toma accion"
}

export enum GenderComplaintBanOptions {
EXPELLED = "EXPULSADO",
MONTHS = "MESES",
ETISNUMBER = "NUMEROS DE ETI"
}


interface GenderComplaint {
    genderComissionAction: GenderComissionActionOptions;
    genderComplaintLastReview: Date;
    genderComplaintLastReviewer: string;
    genderComplaintBan: GenderComplaintBanOptions;  //SI EXPULSADO entonces flag a lista negra
    genderComplaintBanAction: number;
    genderComissionVeredict: string;
    genderComissionInternalComment: string;
}