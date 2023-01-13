import { UserPersonalInfo } from '../shared/User';

type RequiredKeys<T> = { [K in keyof T]-?: undefined extends T[K] ? never : K }[keyof T];
type RequiredProperties<T> = Pick<T, RequiredKeys<T>>;
type RequiredUserData = RequiredProperties<UserPersonalInfo>;

export const isUserDataComplete = (userData: any): userData is RequiredUserData => {
  if (!userData) {
    return false;
  }
  const schema: Record<keyof RequiredUserData, string> = {
    country: '',
    dniNumber: '',
    email: '',
    food: '',
    isCeliac: '',
    nameFirst: '',
    nameLast: ''
  };
  const missingAttributes = Object.keys(schema)
    .filter((key) => userData[key] === undefined)
    .map((key) => key as keyof UserPersonalInfo);
  return missingAttributes.length === 0;
};
