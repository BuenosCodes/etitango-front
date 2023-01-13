import { Grid, TextField as TextFieldMUI } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useEffect, useState } from 'react';
import { getCountries } from 'helpers/thirdParties/restCountries';
import { getProvinces, getCities } from 'helpers/thirdParties/georef';

export const LocationPicker = ({
  touched,
  errors,
  t,
  location,
  setFieldValue
}: {
  touched: any;
  errors: any;
  t: any;
  setFieldValue: any;
  location?: { country: string; province?: string; city?: string };
}) => {
  const [countries, setCountries] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isArgentina, setIsArgentina] = useState(false);

  const handleCountryChange = async (value: string | null) => {
    const isArgentina = value === 'Argentina';
    if (isArgentina) {
      const provinces = (await getProvinces()) as string[];
      setProvinces(provinces);
      location?.province && handleProvinceChange(location.province);
    } else {
      setProvinces([]);
    }
    setIsArgentina(isArgentina);
    setFieldValue('country', value);
  };

  useEffect(() => {
    const getFormData = async () => {
      const countries = await getCountries();
      setCountries(countries);
      location?.country && handleCountryChange(location.country);
    };
    getFormData().catch((error) => console.error(error));
  }, []);

  const handleProvinceChange = async (value: string | null) => {
    if (value) {
      const cities = await getCities(value);
      setCities(cities);
      isArgentina && location?.city && setFieldValue('city', location.city);
    } else {
      setCities([]);
    }
    setFieldValue('province', value);
  };

  return (
    <Grid container spacing={3}>
      <Grid item md={4} sm={4} xs={12}>
        <Autocomplete
          disablePortal
          fullWidth
          options={countries}
          getOptionLabel={(option) => option}
          onChange={(_, value) => handleCountryChange(value)}
          defaultValue={location?.country}
          renderInput={(params) => (
            <TextFieldMUI
              {...params}
              name="country"
              error={touched['country'] && !!errors['country']}
              helperText={touched['country'] && errors['country']}
              label={t('country')}
            />
          )}
        />
      </Grid>
      {isArgentina && (
        <>
          <Grid item md={4} sm={4} xs={12}>
            <Autocomplete
              disablePortal
              fullWidth
              options={provinces}
              getOptionLabel={(option) => option}
              onChange={(_, value) => handleProvinceChange(value)}
              defaultValue={location?.province}
              renderInput={(params) => (
                <TextFieldMUI
                  {...params}
                  name="province"
                  error={touched['province'] && !!errors['province']}
                  helperText={touched['province'] && errors['province']}
                  label={t('province')}
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item md={4} sm={4} xs={12}>
            <Autocomplete
              disablePortal
              fullWidth
              options={cities}
              getOptionLabel={(option) => option}
              onChange={(_, value) => setFieldValue('city', value)}
              defaultValue={location?.city}
              renderInput={(params) => (
                <TextFieldMUI
                  {...params}
                  name="city"
                  error={touched['city'] && !!errors['city']}
                  helperText={touched['city'] && errors['city']}
                  label={t('city')}
                  variant="outlined"
                />
              )}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};
