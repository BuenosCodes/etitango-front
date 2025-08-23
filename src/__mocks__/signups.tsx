import { Signup, SignupStatus, FoodChoices, SignupHelpWith } from '../shared/signup';
import { mockRegularUser } from './users';
import { mockEvent } from './events';

export const mockSignup: Signup = {
  // SignupFormData fields
  dateArrival: new Date(),
  dateDeparture: new Date(),
  helpWith: SignupHelpWith.CLEANING,
  food: FoodChoices.OMNIVORE,
  isCeliac: false,
  country: 'Test Country',
  province: 'Test Province',
  city: 'Test City',
  wantsLodging: true,

  // UserData fields (except lastModifiedAt)
  dniNumber: '12345678',
  email: 'user@example.com',
  nameFirst: 'Test',
  nameLast: 'User',
  phoneNumber: '+5491112345678',
  disability: 'none',
  adminOf: [],
  roles: { admin: false },

  // Signup-specific fields
  id: 'signup-1',
  etiEventId: mockEvent.id,
  status: SignupStatus.PAYMENT_PENDING,
  didAttend: false,
  orderNumber: 1,
  lastModifiedAt: new Date(),
  statusHistory: [
    { status: SignupStatus.PAYMENT_PENDING, date: new Date() }
  ],
  userId: mockRegularUser.uid
}; 