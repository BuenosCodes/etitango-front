import { Firestore } from 'firebase/firestore';

export interface Migration {
  version: number;
  name: string;
  up: (db: Firestore) => Promise<void>;
  down: (db: Firestore) => Promise<void>;
}

export interface MigrationState {
  version: number;
  lastRun: Date;
}

export interface MigrationError {
  version: number;
  error: Error;
  timestamp: Date;
} 