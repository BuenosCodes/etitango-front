import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { UserRoles } from '../shared/User';
import { EtiEvent } from '../shared/etiEvent';

// Initialize Firebase
const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

const db = getFirestore(app);
const auth = getAuth(app);

async function bootstrap() {
  try {
    // Create admin user
    const email = 'admin@example.com';
    const password = 'admin123'; // Change this in production!

    console.log('Creating admin user...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add superadmin and admin roles
    console.log('Adding roles to user...');
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      roles: {
        [UserRoles.SUPER_ADMIN]: true,
        [UserRoles.ADMIN]: true,
      },
      adminOf: [],
      lastModifiedAt: new Date(),
    });

    // Create a test event
    console.log('Creating test event...');
    const now = new Date();
    const eventData: Partial<EtiEvent> = {
      name: 'Test Event',
      location: 'Test Location',
      admins: [user.uid],
      capacity: 100,
      daysBeforeExpiration: 7,
      bank: {
        entity: 'Test Bank',
        holder: 'Test Holder',
        cbu: '1234567890123456789012',
        alias: 'test.alias',
        cuit: '12345678901',
      },
      schedule: [
        {
          title: 'Day 1',
          activities: 'Test activities',
        },
      ],
      locations: [
        {
          name: 'Test Venue',
          link: 'https://maps.google.com/?q=Test+Venue',
        },
      ],
      landingTitle: 'Welcome to Test Event',
      comboReturnDeadlineHuman: '7 days before event',
      lodgingCapacity: 50,
      dateStart: now,
      dateEnd: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      dateSignupOpen: now,
      comboReturnDeadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      prices: [
        {
          deadlineHuman: 'Early bird',
          deadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          price: 1000,
        },
      ],
    };

    const eventRef = await addDoc(collection(db, 'events'), eventData);
    const eventId = eventRef.id;

    // Update user's adminOf array with the new event
    console.log('Updating user with event admin role...');
    await setDoc(doc(db, 'users', user.uid), {
      adminOf: [eventId],
    }, { merge: true });

    console.log('Bootstrap completed successfully!');
    console.log('Admin user:', email);
    console.log('Password:', password);
    console.log('Event ID:', eventId);
  } catch (error) {
    console.error('Bootstrap failed:', error);
    process.exit(1);
  }
}

bootstrap(); 