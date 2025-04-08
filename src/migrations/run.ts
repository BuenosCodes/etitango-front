import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { MigrationManager } from './MigrationManager';
import { addUserRoles } from './001_add_user_roles';

// Initialize Firebase
const app = initializeApp({
  // Your Firebase config here
  // This should be loaded from environment variables
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

const db = getFirestore(app);

// Create migration manager with all migrations
const manager = new MigrationManager(db, [
  addUserRoles,
  // Add more migrations here
]);

// Function to run migrations
async function runMigrations() {
  try {
    console.log('Starting migrations...');
    await manager.migrate();
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Function to rollback migrations
async function rollbackMigrations(steps: number = 1) {
  try {
    console.log(`Rolling back ${steps} migration(s)...`);
    await manager.rollback(steps);
    console.log('Rollback completed successfully');
  } catch (error) {
    console.error('Rollback failed:', error);
    process.exit(1);
  }
}

// Check command line arguments
const args = process.argv.slice(2);
if (args[0] === 'rollback') {
  const steps = parseInt(args[1]) || 1;
  rollbackMigrations(steps);
} else {
  runMigrations();
} 