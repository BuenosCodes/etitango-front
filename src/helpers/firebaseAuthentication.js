import { sendEmailVerification } from 'firebase/auth';
import { auth } from 'etiFirebase.js';

export async function sendVerificationEmail() {
  auth.languageCode = 'es';
  return sendEmailVerification(auth.currentUser);
}
