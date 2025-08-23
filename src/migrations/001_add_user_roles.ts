import { Firestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Migration } from './types';

export const addUserRoles: Migration = {
  version: 1,
  name: 'Add user roles to existing users',
  up: async (db: Firestore) => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      // Only update users that don't have roles
      if (!userData.roles) {
        await updateDoc(doc(db, 'users', userDoc.id), {
          roles: {
            user: true,
          },
          adminOf: [],
        });
      }
    }
  },
  down: async (db: Firestore) => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      // Remove roles and adminOf fields
      if (userData.roles || userData.adminOf) {
        await updateDoc(doc(db, 'users', userDoc.id), {
          roles: null,
          adminOf: null,
        });
      }
    }
  },
}; 