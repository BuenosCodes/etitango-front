import * as fs from 'fs';
import * as functions from 'firebase-functions';
import { SignupStatus } from '../../src/shared/signup';
import { db } from './index';
import { validateUserIsSuperAdmin } from './validators';
import { CallableContext } from 'firebase-functions/lib/providers/https';

const templateSubjects = {
  [SignupStatus.WAITLIST]: 'ETI - En lista de espera',
  [SignupStatus.PAYMENT_PENDING]: 'ETI - Esperando pago',
  [SignupStatus.PAYMENT_DELAYED]: 'ETI - Pago demorado',
  [SignupStatus.CONFIRMED]: 'ETI - Inscripcion confirmada',
  [SignupStatus.CANCELLED]: 'ETI - Inscripcion anulada'
};

function createTemplate(status: SignupStatus) {
  let html;
  try {
    const mypath = `src/templates/${status}.html`;
    html = fs.readFileSync(mypath).toString();
  } catch (e) {
    console.log(`Error reading ${`src/templates/${status}.html`}`, e);
  }

  const template = {
    subject: templateSubjects[status],
    html
  };
  const ref = db.collection('templates').doc(status);
  return ref.set(template);
}

const createTemplates = () =>
  Promise.all(Object.values(SignupStatus).map((status) => createTemplate(status as SignupStatus)));

export const seedDatabase = functions.https.onCall(async (data: any, context: CallableContext) => {
  await validateUserIsSuperAdmin(context);
  await createTemplates();
});
