import {getAuth, sendEmailVerification} from "firebase/auth";

export async function sendVerificaionEmail() {
    const auth = getAuth();
    auth.languageCode = 'es';
    return sendEmailVerification(auth.currentUser);
}