import { EtiEvent } from '../shared/etiEvent';

export const mockEvent: EtiEvent = {
  id: 'event-1',
  image: 'test-image.jpg',
  name: 'Test Event',
  location: 'Test Location',
  admins: ['super-admin-id'],
  capacity: 100,
  daysBeforeExpiration: 30,
  bank: {
    entity: 'Test Bank',
    holder: 'Test Holder',
    cbu: '123456789',
    alias: 'test.alias',
    cuit: '12345678901',
  },
  schedule: [{ title: 'Day 1', activities: 'Test Activities' }],
  locations: [{ name: 'Test Location', link: 'https://test.com' }],
  landingTitle: 'Test Landing Title',
  comboReturnDeadlineHuman: '30 days',
  lodgingCapacity: 50,
  dateStart: new Date(),
  dateEnd: new Date(),
  dateSignupOpen: new Date(),
  comboReturnDeadline: new Date(),
  prices: [
    {
      deadlineHuman: '30 days',
      deadline: new Date(),
      price: 100,
    },
  ],
};

export const mockEvents: EtiEvent[] = [mockEvent]; 