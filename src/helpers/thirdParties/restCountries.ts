import uniq from 'lodash.uniq';

interface RestCountry {
    name: { nativeName: { [lang_key: string]: { common: string } } };
}

export const getCountries = async () => {
    const response = await fetch('https://restcountries.com/v3.1/all')
    const data = await response.json() as RestCountry[];
    const countryNames = data.map(c => c.name.nativeName || c.name)
    return countryNames.map(country => uniq(Object.values(country).map(x => x.common)).join(' / '));
}

