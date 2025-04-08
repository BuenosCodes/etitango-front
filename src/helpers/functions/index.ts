import { httpsCallable } from 'firebase/functions';
import { functions } from '../../etiFirebase';
import { SampleInterface, SampleResponse } from '../../shared/example';
import { getUser } from '../firestore/users';
import { mockFunctions } from '../../__mocks__';

export async function callTest() {
  const helloWorld = httpsCallable<SampleInterface, SampleResponse>(mockFunctions, 'helloWorld');
  const data: SampleInterface = { fieldA: 'hola mundo' };
  const result = await helloWorld(data);
  const { txt } = result.data;
  console.log(txt);
}

export async function createUserInDbIfNotExists(user: { uid: string; email: string } | null) {
  if (!user) {
    console.error('No user received');
    return;
  }

  const userInDb = await getUser(user.uid);
  if (userInDb) {
    return;
  }

  const email = user.email;
  const createUser = httpsCallable(mockFunctions, 'authentication-createUserInDB');

  try {
    await createUser({ email });
  } catch (e) {
    console.log(e);
  }
}
