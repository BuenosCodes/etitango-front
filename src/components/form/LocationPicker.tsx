/* eslint-disable prettier/prettier */
import { Grid, TextField as TextFieldMUI, Typography, InputAdornment } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { getCountries } from 'helpers/thirdParties/restCountries';
import { getProvinces, getCities } from 'helpers/thirdParties/georef';
import { FormikValues, useField } from 'formik';
import { IosShare, Style } from '@mui/icons-material';
import { color } from '@cloudinary/url-gen/qualifiers/background';
import { end } from '@cloudinary/url-gen/qualifiers/textAlignment';

// const useStyles = makeStyles({
//   root: {
//     '& .MuiOutlinedInput-root': {
//       fontFamily: 'inter',
//       '& fieldset': {
//         borderColor: '#E68650',
//         borderRadius: '8px',
//         borderWidth: '1.5px',
          
//       },
//       '&:hover fieldset ': {
//         borderColor: '#E68650',
//         borderRadius: '8px',
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#E68650',
//         borderRadius: '8px',
//       },
      // '& .MuiIconButton-root': { // Estilos para el icono del DatePicker
      //   color: '#A82548', // Cambiar el color del icono aquí
      // }
      
//     },
//   },
// });


export const LocationPicker = ({
  values,
  touched,
  errors,
  t,
  location,
  setFieldValue,
  borderColor,
  specialCase,
  colorFont,
  fontWeight,
  fontFamily,
  isDisabled
}: {
  values: FormikValues;
  touched: any;
  errors: any;
  borderColor: any;
  specialCase: any;
  colorFont: string;
  fontWeight: number;
  fontFamily: string;
  isDisabled: boolean;
  t: any;
  setFieldValue: any;
  location?: { country: string; province?: string; city?: string };
}) => {
  // const [countries, setCountries] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  // const [isArgentina, setIsArgentina] = useState(false);

  // const handleCountryChange = async (value: string | null, userControlled?: boolean) => {
  //   const isArgentina = value === 'Argentina';
  //   if (isArgentina) {
  //     const provinces = (await getProvinces()) as string[];
  //     setProvinces(provinces);
  //     location?.province && handleProvinceChange(location.province);
  //   } else {
  //     setProvinces([]);
  //   }
  //   setIsArgentina(isArgentina);
  //   setFieldValue('country', value);
  //   if (userControlled) {
  //     setFieldValue('province', null);
  //     setFieldValue('city', null);
  //   }
  // };

  useEffect(() => {
    const getFormData = async () => {
      // const countries = await getCountries();
      // setCountries(countries);
      // location?.country && handleCountryChange(location.country);

      const provinces = (await getProvinces()) as string[];
      setProvinces(provinces);
      location?.province && handleProvinceChange(location.province);
    };
    getFormData().catch((error) => console.error(error));
  }, []);

  const handleProvinceChange = async (value: string | null, userControlled?: boolean) => {
    if (value) {
      const cities = await getCities(value);
      setCities(cities);
      location?.city && setFieldValue('city', location.city);
    } else {
      setCities([]);
    }
    setFieldValue('province', value);
    if (userControlled) {
      setFieldValue('city', null);
    }
  };

  const [field] = useField('province' && 'city')
  const useStyles = makeStyles({
    root: {
      '& .MuiOutlinedInput-root': {
        fontFamily: 'inter',
        '& fieldset': {
          borderColor: field.value ? '#E68650' : '#FDE4AA',
          borderRadius: '8px',
          borderWidth: '1.5px',
          pointerEvents: 'none'
        },
        '&:hover fieldset ': {
          borderColor: field.value ? '#E68650' : '#FDE4AA',
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '&.Mui-focused fieldset': {
          borderColor: field.value ? '#E68650' : '#FDE4AA',
          borderRadius: '8px',
          pointerEvents: 'none'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: field.value ? '#E68650' : '#FDE4AA',
        },
        '& .MuiIconButton-root': { // Estilos para el icono del DatePicker
          color: '#A82548', // Cambiar el color del icono aquí
        }
        
      },
    },
  });


  const classes = useStyles()

  const CustomSVGIcon = () => (
    <img src="/img/icon/location.svg" alt="Location Icon" height={25} width={25} /> // Usar la ruta a tu SVG externo
  );
  

  return (
    <Grid container spacing={3}>
      {/* <Grid item md={4} sm={4} xs={12}>
        <Typography style={{fontFamily: 'inter', color: colorFont}}>
            Pais
        </Typography>

        <Autocomplete
          disablePortal
          fullWidth

          options={countries}
          getOptionLabel={(option) => option}
          onChange={(_, value) => handleCountryChange(value, true)}
          value={values?.country || null}
          defaultValue={location?.country}
          classes={{root: classes.root}}
          renderInput={(params) => (
            
            <TextFieldMUI
              {...params}
              name="country"
              error={touched['country'] && !!errors['country']}
              helperText={touched['country'] && errors['country']}
              classes={{root: classes.root}}
              placeholder='Pais'
            />
          )}
        />
      </Grid>
      {isArgentina && (
        <> */}
          <Grid item md={6} sm={6} xs={12}>
            <Typography style={{fontFamily: fontFamily, color: colorFont, fontWeight: fontWeight}}>
                Provincia            
            </Typography>
            <Autocomplete
              disablePortal
              fullWidth
              disabled={isDisabled}
              options={provinces}
              getOptionLabel={(option) => option}
              onChange={(_, value) => handleProvinceChange(value, true)}
              value={values?.province || null}
              defaultValue={location?.province}
              renderInput={(params) => (
                <TextFieldMUI
                  {...params}
                  name="province"
                  error={touched['province'] && !!errors['province']}
                  helperText={touched['province'] && errors['province']}
                  variant="outlined"
                  classes={{root: classes.root}}
                  placeholder='Provincia'     
                  InputProps={{...params.InputProps, startAdornment: (<CustomSVGIcon /> )}}
                />
              )}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
          <Typography style={{fontFamily: fontFamily, color: colorFont, fontWeight: fontWeight}}>
                Ciudad            
            </Typography>
            <Autocomplete
              disablePortal
              fullWidth
              disabled={isDisabled}
              options={cities}
              getOptionLabel={(option) => option}
              onChange={(_, value) => setFieldValue('city', value)}
              value={values?.city || null}
              defaultValue={location?.city}
              renderInput={(params) => (
                <TextFieldMUI
                  {...params}
                  name="city"
                  error={touched['city'] && !!errors['city']}
                  helperText={touched['city'] && errors['city']}
                  variant="outlined"
                  classes={{root: classes.root}}
                  placeholder='Ciudad'
                  InputProps={{...params.InputProps, startAdornment: (<CustomSVGIcon /> )}}              
                />
              )}
            />
          </Grid>
        {/* </>
      )} */}
    </Grid>
  );
};
