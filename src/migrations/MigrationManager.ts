import { Firestore, collection, doc, getDoc, setDoc, addDoc, getDocs } from 'firebase/firestore';
import { Migration, MigrationState, MigrationError } from './types';

export class MigrationManager {
  private readonly db: Firestore;
  private readonly migrations: Migration[];
  private readonly stateCollection = 'migrations';
  private readonly errorCollection = 'migration_errors';

  constructor(db: Firestore, migrations: Migration[]) {
    this.db = db;
    this.migrations = migrations.sort((a, b) => a.version - b.version);
  }

  async getCurrentVersion(): Promise<number> {
    const stateDoc = await getDoc(doc(this.db, this.stateCollection, 'current'));
    if (!stateDoc.exists()) {
      return 0;
    }
    return (stateDoc.data() as MigrationState).version;
  }

  async getMigrationErrors(): Promise<MigrationError[]> {
    const errorsSnapshot = await getDocs(collection(this.db, this.errorCollection));
    return errorsSnapshot.docs.map(doc => doc.data() as MigrationError);
  }

  private async updateVersion(version: number): Promise<void> {
    await setDoc(doc(this.db, this.stateCollection, 'current'), {
      version,
      lastRun: new Date(),
    });
  }

  private async logError(error: MigrationError): Promise<void> {
    await addDoc(collection(this.db, this.errorCollection), error);
  }

  async migrate(targetVersion?: number): Promise<void> {
    const currentVersion = await this.getCurrentVersion();
    const target = targetVersion ?? Math.max(...this.migrations.map(m => m.version));

    if (target > currentVersion) {
      // Migrate up
      for (const migration of this.migrations) {
        if (migration.version > currentVersion && migration.version <= target) {
          try {
            await migration.up(this.db);
            await this.updateVersion(migration.version);
          } catch (error) {
            await this.logError({
              version: migration.version,
              error: error as Error,
              timestamp: new Date(),
            });
            throw error;
          }
        }
      }
    } else if (target < currentVersion) {
      // Migrate down
      for (const migration of [...this.migrations].reverse()) {
        if (migration.version <= currentVersion && migration.version > target) {
          try {
            await migration.down(this.db);
            await this.updateVersion(migration.version - 1);
          } catch (error) {
            await this.logError({
              version: migration.version,
              error: error as Error,
              timestamp: new Date(),
            });
            throw error;
          }
        }
      }
    }
  }

  async rollback(steps: number = 1): Promise<void> {
    const currentVersion = await this.getCurrentVersion();
    const targetVersion = Math.max(0, currentVersion - steps);
    await this.migrate(targetVersion);
  }
} 