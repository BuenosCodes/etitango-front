const { setup, teardown } = require('./helpers');

describe('Users rules', () => {
  const someAdmin = 'someAdmin';
  const someNonAdmin = 'someNonAdmin';
  const collectionPath = 'users';
  const randomData = { a: true };

  const mockData = {
    'users/someAdmin': {
      roles: {
        admin: true
      }
    },
    'users/someNonAdmin': {}
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

  test('allow to create when userId matches', async () => {
    const db = await setup({ uid: someNonAdmin }, mockData);
    const docRef = db.collection(collectionPath).doc(someNonAdmin);
    await expect(docRef.set(randomData)).toAllow();
  });

  test('deny read when userId does not match', async () => {
    const db = await setup({ uid: someNonAdmin }, mockData);
    const docRef = db.collection(collectionPath).doc(someAdmin);
    await expect(docRef.get()).toDeny();
    await expect(docRef.update(randomData)).toDeny();
  });
});
