import { etiEventSchema, etiEventFirestoreSchema, signupSchema, toFirestore, fromFirestore } from './schemas';
import { Timestamp } from 'firebase/firestore';

describe('Schema Validation', () => {
  describe('etiEventSchema', () => {
    const validEvent = {
      id: 'test-event',
      image: 'https://example.com/image.jpg',
      name: 'Test Event',
      location: 'Test Location',
      admins: ['admin1', 'admin2'],
      capacity: 100,
      daysBeforeExpiration: 30,
      bank: {
        entity: 'Test Bank',
        holder: 'John Doe',
        cbu: '1234567890123456789012',
        alias: 'test.alias',
        cuit: '12345678901',
      },
      schedule: [{
        title: 'Day 1',
        activities: 'Morning activities',
      }],
      locations: [{
        name: 'Main Venue',
        link: 'https://example.com/venue',
      }],
      landingTitle: 'Welcome to Test Event',
      comboReturnDeadlineHuman: 'Before event starts',
      lodgingCapacity: 50,
      dateStart: new Date('2024-01-01'),
      dateEnd: new Date('2024-01-07'),
      dateSignupOpen: new Date('2023-12-01'),
      comboReturnDeadline: new Date('2023-12-15'),
      prices: [{
        deadlineHuman: 'Early Bird',
        deadline: new Date('2023-11-01'),
        price: 100,
      }],
    };

    it('should validate a valid event', () => {
      const result = etiEventSchema.safeParse(validEvent);
      if (!result.success) {
        console.log('Validation errors:', result.error.errors);
      }
      expect(result.success).toBe(true);
    });

    it('should reject an invalid event', () => {
      const invalidEvent = {
        ...validEvent,
        capacity: -1,
      };
      const result = etiEventSchema.safeParse(invalidEvent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Capacity must be positive');
      }
    });
  });

  describe('signupSchema', () => {
    const validSignup = {
      dateArrival: new Date('2024-01-01'),
      dateDeparture: new Date('2024-01-07'),
      helpWith: 'cleaning',
      food: 'omnivore',
      isCeliac: false,
      country: 'Argentina',
      province: 'Buenos Aires',
      city: 'Capital Federal',
      wantsLodging: true,
    };

    it('should validate a valid signup', () => {
      const result = signupSchema.safeParse(validSignup);
      expect(result.success).toBe(true);
    });

    it('should reject an invalid signup', () => {
      const invalidSignup = {
        ...validSignup,
        helpWith: 'invalid-role',
      };
      const result = signupSchema.safeParse(invalidSignup);
      expect(result.success).toBe(false);
    });
  });

  describe('Firestore Conversion', () => {
    it('should convert dates to timestamps', () => {
      const event = {
        id: 'test-event',
        image: 'https://example.com/image.jpg',
        name: 'Test Event',
        location: 'Test Location',
        admins: ['admin1'],
        capacity: 100,
        daysBeforeExpiration: 30,
        bank: {
          entity: 'Test Bank',
          holder: 'John Doe',
          cbu: '123456789',
          alias: 'test.alias',
          cuit: '12345678901',
        },
        schedule: [{
          title: 'Day 1',
          activities: 'Morning activities',
        }],
        locations: [{
          name: 'Main Venue',
          link: 'https://example.com/venue',
        }],
        landingTitle: 'Welcome to Test Event',
        comboReturnDeadlineHuman: 'Before event starts',
        lodgingCapacity: 50,
        dateStart: new Date('2024-01-01'),
        dateEnd: new Date('2024-01-07'),
        dateSignupOpen: new Date('2023-12-01'),
        comboReturnDeadline: new Date('2023-12-15'),
        prices: [{
          deadlineHuman: 'Early Bird',
          deadline: new Date('2023-11-01'),
          price: 100,
        }],
      };

      const firestoreEvent = toFirestore.etiEvent(event);
      expect(firestoreEvent.dateStart).toBeInstanceOf(Timestamp);
      expect(firestoreEvent.dateEnd).toBeInstanceOf(Timestamp);
      expect(firestoreEvent.dateSignupOpen).toBeInstanceOf(Timestamp);
      expect(firestoreEvent.comboReturnDeadline).toBeInstanceOf(Timestamp);
      expect(firestoreEvent.prices[0].deadline).toBeInstanceOf(Timestamp);
    });

    it('should convert timestamps back to dates', () => {
      const firestoreEvent = {
        id: 'test-event',
        image: 'https://example.com/image.jpg',
        name: 'Test Event',
        location: 'Test Location',
        admins: ['admin1'],
        capacity: 100,
        daysBeforeExpiration: 30,
        bank: {
          entity: 'Test Bank',
          holder: 'John Doe',
          cbu: '123456789',
          alias: 'test.alias',
          cuit: '12345678901',
        },
        schedule: [{
          title: 'Day 1',
          activities: 'Morning activities',
        }],
        locations: [{
          name: 'Main Venue',
          link: 'https://example.com/venue',
        }],
        landingTitle: 'Welcome to Test Event',
        comboReturnDeadlineHuman: 'Before event starts',
        lodgingCapacity: 50,
        dateStart: Timestamp.fromDate(new Date('2024-01-01')),
        dateEnd: Timestamp.fromDate(new Date('2024-01-07')),
        dateSignupOpen: Timestamp.fromDate(new Date('2023-12-01')),
        comboReturnDeadline: Timestamp.fromDate(new Date('2023-12-15')),
        prices: [{
          deadlineHuman: 'Early Bird',
          deadline: Timestamp.fromDate(new Date('2023-11-01')),
          price: 100,
        }],
      };

      const event = fromFirestore.etiEvent(firestoreEvent);
      expect(event.dateStart).toBeInstanceOf(Date);
      expect(event.dateEnd).toBeInstanceOf(Date);
      expect(event.dateSignupOpen).toBeInstanceOf(Date);
      expect(event.comboReturnDeadline).toBeInstanceOf(Date);
      expect(event.prices[0].deadline).toBeInstanceOf(Date);
    });
  });
}); 