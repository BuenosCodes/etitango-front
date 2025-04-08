import { Firestore } from 'firebase/firestore';
import { MigrationManager } from './MigrationManager';
import { addUserRoles } from './001_add_user_roles';
import { mockFirestore } from '../__mocks__/firebase';

// Mock Firestore
jest.mock('firebase/firestore', () => {
  const mockDoc = jest.fn();
  const mockCollection = jest.fn();
  const mockGetDoc = jest.fn();
  const mockGetDocs = jest.fn();
  const mockSetDoc = jest.fn();
  const mockAddDoc = jest.fn();
  const mockUpdateDoc = jest.fn();

  const mockCollectionRef = (db: any, path: string) => ({
    id: path.split('/').pop(),
    path,
    parent: null,
    doc: (docId: string) => mockDoc(db, path, docId),
  });

  const mockDocRef = (db: any, collectionPath: string, docId: string) => ({
    id: docId,
    path: `${collectionPath}/${docId}`,
    parent: mockCollectionRef(db, collectionPath),
    collection: (path: string) => mockCollection(db, path),
  });

  mockDoc.mockImplementation(mockDocRef);
  mockCollection.mockImplementation(mockCollectionRef);

  // Default mock implementation
  mockGetDoc.mockImplementation((docRef) => {
    if (!docRef) {
      throw new Error('Document reference is required');
    }
    const docSnapshot = {
      exists: () => false,
      data: () => null,
      id: docRef.id || 'current',
      ref: docRef,
    };
    return Promise.resolve(docSnapshot);
  });

  return {
    getDoc: mockGetDoc,
    getDocs: mockGetDocs,
    setDoc: mockSetDoc,
    addDoc: mockAddDoc,
    doc: mockDoc,
    updateDoc: mockUpdateDoc,
    collection: mockCollection,
  };
});

describe('MigrationManager', () => {
  let db: Firestore;
  let manager: MigrationManager;
  let mockDoc: jest.Mock;
  let mockCollection: jest.Mock;
  let mockGetDoc: jest.Mock;
  let mockGetDocs: jest.Mock;
  let mockSetDoc: jest.Mock;
  let mockAddDoc: jest.Mock;
  let mockUpdateDoc: jest.Mock;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Get mock functions
    const firestore = require('firebase/firestore');
    mockDoc = firestore.doc;
    mockCollection = firestore.collection;
    mockGetDoc = firestore.getDoc;
    mockGetDocs = firestore.getDocs;
    mockSetDoc = firestore.setDoc;
    mockAddDoc = firestore.addDoc;
    mockUpdateDoc = firestore.updateDoc;

    // Create a mock Firestore instance
    db = mockFirestore;
    manager = new MigrationManager(db, [addUserRoles]);

    // Set up default mock implementations for document snapshots
    mockGetDocs.mockImplementation(async (collectionRef: any) => ({
      docs: [],
      empty: true,
      size: 0,
    }));
  });

  describe('constructor', () => {
    it('should sort migrations by version', () => {
      const migrations = [
        { version: 2, name: 'test2', up: jest.fn(), down: jest.fn() },
        { version: 1, name: 'test1', up: jest.fn(), down: jest.fn() },
        { version: 3, name: 'test3', up: jest.fn(), down: jest.fn() },
      ];
      const manager = new MigrationManager(db, migrations);
      expect(manager['migrations'].map(m => m.version)).toEqual([1, 2, 3]);
    });
  });

  describe('getCurrentVersion', () => {
    it('should return 0 when no version is set', async () => {
      const docRef = mockDoc(db, 'migrations', 'current');
      mockGetDoc.mockResolvedValueOnce({
        exists: () => false,
        data: () => null,
        id: 'current',
        ref: docRef,
      });
      
      const version = await manager.getCurrentVersion();
      expect(version).toBe(0);
    });

    it('should return the current version when set', async () => {
      const docRef = mockDoc(db, 'migrations', 'current');
      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ version: 1 }),
        id: 'current',
        ref: docRef,
      });
      
      const version = await manager.getCurrentVersion();
      expect(version).toBe(1);
    });
  });

  describe('getMigrationErrors', () => {
    it('should return migration errors from the error collection', async () => {
      const mockErrors = [
        { version: 1, error: new Error('Test error 1'), timestamp: new Date() },
        { version: 2, error: new Error('Test error 2'), timestamp: new Date() },
      ];
      
      mockGetDocs.mockResolvedValueOnce({
        docs: mockErrors.map(error => ({
          data: () => error,
          id: error.version.toString(),
          ref: mockDoc(db, 'migration_errors', error.version.toString()),
        })),
        empty: false,
        size: mockErrors.length,
      });

      const errors = await manager.getMigrationErrors();
      expect(errors).toEqual(mockErrors);
    });
  });

  describe('migrate', () => {
    it('should run migrations in order', async () => {
      // Mock getCurrentVersion to return 0
      const stateDocRef = mockDoc(db, 'migrations', 'current');
      mockGetDoc.mockResolvedValueOnce({
        exists: () => false,
        data: () => null,
        id: 'current',
        ref: stateDocRef,
      });
      
      // Mock the users collection for the migration
      const usersCollectionRef = mockCollection(db, 'users');
      mockGetDocs.mockResolvedValueOnce({
        docs: [
          {
            id: 'user1',
            data: () => ({ roles: undefined }),
            ref: mockDoc(db, 'users', 'user1'),
          },
        ],
        empty: false,
        size: 1,
      });

      await manager.migrate();

      expect(mockSetDoc).toHaveBeenCalledWith(
        stateDocRef,
        expect.objectContaining({ version: 1 })
      );
    });

    it('should handle migration errors', async () => {
      // Mock getCurrentVersion to return 0
      const stateDocRef = mockDoc(db, 'migrations', 'current');
      mockGetDoc.mockResolvedValueOnce({
        exists: () => false,
        data: () => null,
        id: 'current',
        ref: stateDocRef,
      });

      // Mock the migration to throw an error
      const usersCollectionRef = mockCollection(db, 'users');
      mockGetDocs.mockRejectedValueOnce(new Error('Test error'));

      // Create a mock collection reference for migration errors
      const errorsCollectionRef = mockCollection(db, 'migration_errors');
      mockCollection.mockReturnValueOnce(errorsCollectionRef);

      await expect(manager.migrate()).rejects.toThrow('Test error');

      expect(mockAddDoc).toHaveBeenCalledWith(
        errorsCollectionRef,
        expect.objectContaining({
          version: 1,
          error: expect.any(Error),
          timestamp: expect.any(Date),
        })
      );
    });

    it('should migrate to a specific target version', async () => {
      // Mock getCurrentVersion to return 0
      const stateDocRef = mockDoc(db, 'migrations', 'current');
      mockGetDoc.mockResolvedValueOnce({
        exists: () => false,
        data: () => null,
        id: 'current',
        ref: stateDocRef,
      });

      // Add a second migration
      const migration2 = {
        version: 2,
        name: 'test2',
        up: jest.fn(),
        down: jest.fn(),
      };
      manager = new MigrationManager(db, [addUserRoles, migration2]);

      // Mock the users collection for both migrations
      const usersCollectionRef = mockCollection(db, 'users');
      mockGetDocs.mockResolvedValueOnce({
        docs: [
          {
            id: 'user1',
            data: () => ({ roles: undefined }),
            ref: mockDoc(db, 'users', 'user1'),
          },
        ],
        empty: false,
        size: 1,
      });

      await manager.migrate(2);

      expect(mockSetDoc).toHaveBeenLastCalledWith(
        stateDocRef,
        expect.objectContaining({ version: 2 })
      );
    });

    it('should handle down migrations', async () => {
      // Create a mock migration with version 2
      const mockMigration = {
        version: 2,
        name: 'test2',
        up: jest.fn(),
        down: jest.fn().mockResolvedValue(undefined),
      };
      manager = new MigrationManager(db, [mockMigration]);

      // Mock getCurrentVersion to return 2
      const stateDocRef = mockDoc(db, 'migrations', 'current');
      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ version: 2 }),
        id: 'current',
        ref: stateDocRef,
      });

      // Mock updateVersion call
      mockSetDoc.mockResolvedValueOnce(undefined);

      await manager.migrate(1);

      expect(mockMigration.down).toHaveBeenCalledWith(db);
      expect(mockSetDoc).toHaveBeenCalledWith(
        stateDocRef,
        expect.objectContaining({ version: 1 })
      );
    });

    it('should handle errors during down migrations', async () => {
      // Create a mock migration with version 2 that throws an error
      const mockMigration = {
        version: 2,
        name: 'test2',
        up: jest.fn(),
        down: jest.fn().mockRejectedValue(new Error('Down migration failed')),
      };
      manager = new MigrationManager(db, [mockMigration]);

      // Mock getCurrentVersion to return 2
      const stateDocRef = mockDoc(db, 'migrations', 'current');
      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ version: 2 }),
        id: 'current',
        ref: stateDocRef,
      });

      // Mock error collection
      const errorsCollectionRef = mockCollection(db, 'migration_errors');
      mockCollection.mockReturnValueOnce(errorsCollectionRef);
      mockAddDoc.mockResolvedValueOnce(undefined);

      await expect(manager.migrate(1)).rejects.toThrow('Down migration failed');

      expect(mockAddDoc).toHaveBeenCalledWith(
        errorsCollectionRef,
        expect.objectContaining({
          version: 2,
          error: expect.any(Error),
          timestamp: expect.any(Date),
        })
      );
    });
  });

  describe('rollback', () => {
    it('should rollback the specified number of steps', async () => {
      // Create a mock migration with version 2
      const mockMigration = {
        version: 2,
        name: 'test2',
        up: jest.fn(),
        down: jest.fn().mockResolvedValue(undefined),
      };
      manager = new MigrationManager(db, [mockMigration]);

      // Mock getCurrentVersion to return 2 for both calls
      const stateDocRef = mockDoc(db, 'migrations', 'current');
      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ version: 2 }),
        id: 'current',
        ref: stateDocRef,
      }).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ version: 2 }),
        id: 'current',
        ref: stateDocRef,
      });

      // Mock updateVersion call
      mockSetDoc.mockResolvedValueOnce(undefined);

      await manager.rollback(1);

      expect(mockMigration.down).toHaveBeenCalledWith(db);
      expect(mockSetDoc).toHaveBeenCalledWith(
        stateDocRef,
        expect.objectContaining({ version: 1 })
      );
    });

    it('should not rollback below version 0', async () => {
      // Create a mock migration with version 1
      const mockMigration = {
        version: 1,
        name: 'test1',
        up: jest.fn(),
        down: jest.fn().mockResolvedValue(undefined),
      };
      manager = new MigrationManager(db, [mockMigration]);

      // Mock getCurrentVersion to return 1 for both calls
      const stateDocRef = mockDoc(db, 'migrations', 'current');
      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ version: 1 }),
        id: 'current',
        ref: stateDocRef,
      }).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ version: 1 }),
        id: 'current',
        ref: stateDocRef,
      });

      // Mock updateVersion call
      mockSetDoc.mockResolvedValueOnce(undefined);

      await manager.rollback(2);

      expect(mockMigration.down).toHaveBeenCalledWith(db);
      expect(mockSetDoc).toHaveBeenCalledWith(
        stateDocRef,
        expect.objectContaining({ version: 0 })
      );
    });
  });
});

describe('addUserRoles migration', () => {
  let db: Firestore;
  let mockDoc: jest.Mock;
  let mockCollection: jest.Mock;
  let mockGetDocs: jest.Mock;
  let mockUpdateDoc: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Get mock functions
    const firestore = require('firebase/firestore');
    mockDoc = firestore.doc;
    mockCollection = firestore.collection;
    mockGetDocs = firestore.getDocs;
    mockUpdateDoc = firestore.updateDoc;

    // Create a mock Firestore instance
    db = mockFirestore;
  });

  describe('up migration', () => {
    it('should add default roles to users without roles', async () => {
      const mockUsers = [
        { id: 'user1', data: () => ({ roles: undefined }) },
        { id: 'user2', data: () => ({ roles: { admin: true } }) },
        { id: 'user3', data: () => ({ roles: undefined }) },
      ];

      mockGetDocs.mockResolvedValueOnce({
        docs: mockUsers.map(user => ({
          ...user,
          ref: mockDoc(db, 'users', user.id),
        })),
        empty: false,
        size: mockUsers.length,
      });

      await addUserRoles.up(db);

      expect(mockUpdateDoc).toHaveBeenCalledTimes(2);
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        mockDoc(db, 'users', 'user1'),
        expect.objectContaining({
          roles: { user: true },
          adminOf: [],
        })
      );
    });

    it('should handle empty users collection', async () => {
      mockGetDocs.mockResolvedValueOnce({
        docs: [],
        empty: true,
        size: 0,
      });

      await addUserRoles.up(db);

      expect(mockUpdateDoc).not.toHaveBeenCalled();
    });

    it('should handle errors during user updates', async () => {
      const mockUsers = [
        { id: 'user1', data: () => ({ roles: undefined }) },
      ];

      mockGetDocs.mockResolvedValueOnce({
        docs: mockUsers.map(user => ({
          ...user,
          ref: mockDoc(db, 'users', user.id),
        })),
        empty: false,
        size: mockUsers.length,
      });

      mockUpdateDoc.mockRejectedValueOnce(new Error('Update failed'));

      await expect(addUserRoles.up(db)).rejects.toThrow('Update failed');
    });
  });

  describe('down migration', () => {
    it('should remove roles and adminOf fields from users', async () => {
      const mockUsers = [
        { id: 'user1', data: () => ({ roles: { user: true }, adminOf: ['org1'] }) },
        { id: 'user2', data: () => ({ roles: undefined, adminOf: undefined }) },
        { id: 'user3', data: () => ({ roles: { admin: true }, adminOf: ['org2'] }) },
      ];

      mockGetDocs.mockResolvedValueOnce({
        docs: mockUsers.map(user => ({
          ...user,
          ref: mockDoc(db, 'users', user.id),
        })),
        empty: false,
        size: mockUsers.length,
      });

      await addUserRoles.down(db);

      expect(mockUpdateDoc).toHaveBeenCalledTimes(2);
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        mockDoc(db, 'users', 'user1'),
        expect.objectContaining({
          roles: null,
          adminOf: null,
        })
      );
    });

    it('should handle empty users collection', async () => {
      mockGetDocs.mockResolvedValueOnce({
        docs: [],
        empty: true,
        size: 0,
      });

      await addUserRoles.down(db);

      expect(mockUpdateDoc).not.toHaveBeenCalled();
    });

    it('should handle errors during user updates', async () => {
      const mockUsers = [
        { id: 'user1', data: () => ({ roles: { user: true }, adminOf: ['org1'] }) },
      ];

      mockGetDocs.mockResolvedValueOnce({
        docs: mockUsers.map(user => ({
          ...user,
          ref: mockDoc(db, 'users', user.id),
        })),
        empty: false,
        size: mockUsers.length,
      });

      mockUpdateDoc.mockRejectedValueOnce(new Error('Update failed'));

      await expect(addUserRoles.down(db)).rejects.toThrow('Update failed');
    });
  });
}); 