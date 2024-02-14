// advanceSignups.int.test.ts
import * as admin from 'firebase-admin';

// @ts-ignore
import { setup, teardown } from './helpers.js';
import { doAdvanceSignups } from '../../signup';
import * as MockDate from 'mockdate';
import { SignupStatus } from '../../../../src/shared/signup';

// @ts-ignore
let app;
beforeAll(async () => {
  await setup();
});

describe('advanceSignups Integration Test', () => {
  MockDate.set('2024-01-06');
  it('works', async () => {
    const createDoc = async (id: string, data: any) => {
      await signupsRef.doc(id).set({
        id: id,
        etiEventId: eventId,
        ...data
      });
      return signupsRef.doc(id);
    };
    // Pre-populate your database with test data
    const eventId = 'event';
    const signupsRef = admin.firestore().collection('signups');

    const signups = [
      {
        id: 'id1',
        data: {
          status: SignupStatus.FLAGGED,
          orderNumber: 1,
          lastModifiedAt: new Date('2024-01-01')
        },
        expected: SignupStatus.CANCELLED
      },
      {
        id: 'id11',
        data: {
          status: SignupStatus.PAYMENT_PENDING,
          orderNumber: 1,
          lastModifiedAt: new Date('2024-01-01')
        },
        expected: SignupStatus.CANCELLED
      },
      {
        id: 'id2',
        data: {
          status: SignupStatus.PAYMENT_PENDING,
          orderNumber: 2,
          lastModifiedAt: new Date('2024-01-05')
        },
        expected: SignupStatus.PAYMENT_PENDING
      },
      {
        id: 'id3',
        data: {
          status: SignupStatus.WAITLIST,
          orderNumber: 3,
          lastModifiedAt: new Date('2024-01-05')
        },
        expected: SignupStatus.PAYMENT_PENDING
      }
    ];
    await Promise.all(signups.map(({ id, data }) => createDoc(id, data)));

    await doAdvanceSignups({ capacity: 2, daysBeforeExpiration: 5, id: eventId });

    for (const { id, expected } of signups) {
      const updatedDoc = await signupsRef.doc(id).get();
      expect(updatedDoc.data()?.status).toBe(expected);
    }
  });
});

afterAll(async () => {
  // Clean up the app
  // @ts-ignore
  // await teardown();
});
