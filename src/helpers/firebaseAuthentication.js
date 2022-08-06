import {getAuth, sendEmailVerification} from "firebase/auth";

export async function sendVerificationEmail() {
    const auth = getAuth();
    auth.languageCode = 'es';
    return sendEmailVerification(auth.currentUser);
}