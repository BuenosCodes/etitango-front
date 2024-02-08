import * as fs from 'fs';
import * as functions from 'firebase-functions';
import { AutoEmailSignupStatus, SignupStatus } from '../../src/shared/signup';
import { db } from './index';
import { validateUserIsSuperAdmin } from './validators';
import { CallableContext } from 'firebase-functions/lib/common/providers/https';

const templateSubjects = {
  [SignupStatus.WAITLIST]: 'ETI - En lista de espera',
  [SignupStatus.PAYMENT_PENDING]: 'ETI - Esperando pago',
  [SignupStatus.PAYMENT_TO_CONFIRM]: 'ETI - Procesando Pago',
  [SignupStatus.PAYMENT_DELAYED]: 'ETI - Pago demorado',
  [SignupStatus.CONFIRMED]: 'ETI - Inscripcion confirmada',
  [SignupStatus.CANCELLED]: 'ETI - Inscripcion anulada'
};

function createEti() {
  const values = {
    dateEnd: new Date('Mon Nov 28 2022 14:41:00 GMT-0300 (Argentina Standard Time)'),
    dateSignupOpen: new Date('Sat Oct 15 2022 15:33:40 GMT-0300 (Argentina Standard Time)'),

    dateStart: new Date('Sat Nov 26 2022 14:40:52 GMT-0300 (Argentina Standard Time)'),
    location: 'Sierra de la Ventana',
    name: 'Futuro Eti'
  };
  const ref = db.collection('events');
  return ref.add(values);
}

function createTemplate(status: AutoEmailSignupStatus) {
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
  Promise.all(
    Object.values(AutoEmailSignupStatus).map((status) =>
      createTemplate(status as AutoEmailSignupStatus)
    )
  );

export const seedDatabase = functions.https.onCall(async (data: any, context: CallableContext) => {
  await validateUserIsSuperAdmin(context);
  await createTemplates();
  await createEti();
});

export const upsertTemplates = functions.https.onCall(
  async (data: any, context: CallableContext) => {
    try {
      await validateUserIsSuperAdmin(context);
      await createTemplates();
      return;
    } catch (e) {
      console.log(e);
      throw new functions.https.HttpsError('internal', JSON.stringify(e));
    }
  }
);
