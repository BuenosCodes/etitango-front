const { setup, teardown } = require('./helpers');

describe('Signups rules', () => {
  const someAdmin = 'someAdmin';
  const someNonAdmin = 'someNonAdmin';
  const collectionPath = 'signups';
  const fromSomeNonAdmin = 'fromSomeNonAdmin';
  const randomData = { a: true };
  const mockData = {
    'users/someAdmin': {
      roles: {
        admin: true
      }
    },
    'users/someNonAdmin': {},
    'signups/fromSomeNonAdmin': {
      userId: someNonAdmin
    }
  };

  afterAll(async () => {
    await teardown();
  });

  test('fail all when user not logged in', async () => {
    const db = await setup();
    const collectionRef = db.collection(collectionPath);
    const docRef = db.collection(collectionPath).doc('random');
    await expect(collectionRef.get()).toDeny();
    await expect(collectionRef.add(randomData)).toDeny();
    await expect(docRef.get()).toDeny();
    await expect(docRef.update(randomData)).toDeny();
    await expect(docRef.delete()).toDeny();
  });

  test('allow to read when user logged in', async () => {
    const db = await setup({ uid: someNonAdmin });
    const collectionRef = db.collection(collectionPath);
    await expect(collectionRef.get()).toAllow();
  });

  test('allow to create and update when userId matches', async () => {
    const db = await setup({ uid: someNonAdmin }, mockData);
    const collectionRef = db.collection(collectionPath);
    await expect(collectionRef.add({ userId: someNonAdmin })).toAllow();
    const docRef = collectionRef.doc(fromSomeNonAdmin);
    await expect(docRef.update(randomData)).toAllow();
  });

  test('only allow read when userId does not match and is not admin', async () => {
    const db = await setup({ uid: someNonAdmin }, mockData);
    const collectionRef = db.collection(collectionPath);
    const docRef = collectionRef.doc(someAdmin);
    await expect(docRef.get()).toAllow();
    await expect(docRef.update(randomData)).toDeny();
    await expect(collectionRef.add(randomData)).toDeny();
  });

  test('allow update but not create when userId does not match and is admin', async () => {
    const db = await setup({ uid: someAdmin }, mockData);
    const collectionRef = db.collection(collectionPath);
    const docRef = collectionRef.doc(fromSomeNonAdmin);
    await expect(docRef.get()).toAllow();
    await expect(docRef.update(randomData)).toAllow();
    await expect(collectionRef.add(randomData)).toDeny();
  });

  test('denies update when updating userId or etiEventId', async () => {
    const db = await setup({ uid: someAdmin }, mockData);
    const collectionRef = db.collection(collectionPath);
    const docRef = collectionRef.doc(fromSomeNonAdmin);
    await expect(docRef.update({ userId: 'userId' })).toDeny();
    await expect(docRef.update({ etiEventId: 'etiEventId' })).toDeny();
  });
});
