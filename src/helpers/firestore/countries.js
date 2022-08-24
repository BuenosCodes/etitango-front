import { getCollection } from './index';

const COUNTRIES = 'countries';
const PROVINCES = `provinces`;
const CITIES = `cities`;

export const getCountries = async () => getCollection(COUNTRIES);
export const getProvinces = async (countryId) =>
  getCollection(`${COUNTRIES}/${countryId}/${PROVINCES}`);
export const getCities = async (countryId, provinceId) =>
  getCollection(`${COUNTRIES}/${countryId}/${PROVINCES}/${provinceId}/${CITIES}`);
