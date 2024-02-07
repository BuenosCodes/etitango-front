const { setup, teardown } = require('./helpers');

describe('Database rules', () => {
  beforeAll(() => {
    const validateUserIsLoggedIn = jest.fn().mockResolvedValue(true);
    const validateUserOwnsTheEvent = jest.fn().mockResolvedValue(true);
  });

  afterAll(async () => {
    await teardown();
  });

  test('fail when reading/writing an unauthorized collection', async () => {
    const db = await setup();
    const randomRef = db.collection('some-nonexistent-collection');
    await expect(randomRef.get()).toDeny();
  });
});
