import React, { PureComponent } from 'react'
import { DatePicker } from '@mui/lab';
import { Autocomplete, Button, Checkbox, Container, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { debounce } from 'debounce';
import { produce } from 'immer';
import AppAppBar from '../../components/AppAppBar';

import { HELP_WITH_CHOICES, FOOD_CHOICES, VALIDATION_RULES } from './inscripcion.constants';

class Inscripcion extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      allProvinces: [],
      provinces: [],
      allCities: [],
      cities: [],
      errors: {},
      pristine: true,
      //FormData
      name: "",
      last_name: "",
      email: "",
      dni_number: "",
      status: "W",
      arrival_date: "2022-03-26",
      leave_date: "2022-03-28",
      help_with: "",
      food: "",
      is_celiac: false,
      vaccinated: false,
      country: null,
      province: null,
      city: null
    };
  }

  componentDidMount = async () => {
    try {
      const locations = Promise.all([
        axios.get(`${window.location.protocol}//${process.env.REACT_APP_BACK_END_URL || 'localhost:8000'}/location/countries/`),
        axios.get(`${window.location.protocol}//${process.env.REACT_APP_BACK_END_URL || 'localhost:8000'}/location/provinces/`),
        axios.get(`${window.location.protocol}//${process.env.REACT_APP_BACK_END_URL || 'localhost:8000'}/location/cities/`)
      ])
      locations
        .then((response) => {
          this.setState({
            countries: response[0].data,
            allProvinces: response[1].data,
            allCities: response[2].data,
          })
        })
        .catch(e => {
          console.error(e)
        })

    } catch (e) {
    }
  }

  handleOnChange = ({ target }) => {
    this.setState({ [target.name]: target.value })
    debounce(this.validateField(target.name, target.value), 500);
  }

  handleArrivalDateChange = (newValue) => {
    if (!newValue) return
    this.setState({ arrival_date: `${newValue.year()}-${newValue.month() + 1}-${newValue.date()}` })
  }

  handleLeaveDateChange = (newValue) => {
    if (!newValue) return
    this.setState({ leave_date: `${newValue.year()}-${newValue.month() + 1}-${newValue.date()}` })
  }

  handleIsCeliacChange = (e, is_celiac) => {
    this.setState({ is_celiac })
  }

  handleIsVaccinatedChange = (e, vaccinated) => {
    this.setState({ vaccinated })
  }

  handleCountryChange = (e, value) => {
    if (!value) return;
    let provinces = []
    if (value.country_id === 'AR' || value.country_id === 'CL') {
      provinces = this.state.allProvinces.filter(c => c.country === value.country_id);
    } else {
      provinces = this.state.allProvinces;
    }
    this.setState({ provinces, country: value })
  }

  handleProvinceChange = (e, value) => {
    if (!value) return;
    let cities;
    if (value.country_id === 'AR' || value.country_id === 'CL') {
      cities = this.state.allCities.filter(c => c.province === value.id);
    } else {
      cities = this.state.allCities;
    }
    this.setState({ cities, province: value })
  }

  handleCityChange = (e, value) => {
    if (!value) return;
    this.setState({ city: value })
  }

  save = () => {
    const { name, last_name, email, dni_number, arrival_date, leave_date, help_with, food, is_celiac, country, province, city } = this.state;
    let data = {
      name,
      last_name,
      email,
      dni_number,
      arrival_date,
      leave_date,
      help_with: help_with.value,
      food: food.value,
      is_celiac,
      country: (country && country.id) || null,
      province: (province && province.id) || null,
      city: (city && city.id) || null
    };
    if (!country);
    delete data.country;
    if (!province);
    delete data.province;
    if (!city);
    delete data.city;

    axios.post(`${window.location.protocol}//${process.env.REACT_APP_BACK_END_URL || 'localhost:8000'}/event/inscription/`, data)
      .then(response => {
        window.location.href = `${window.location.protocol}//${process.env.REACT_APP_FRONT_END_URL || 'localhost:3000'}/lista-inscriptos`;
      })
      .catch((error) => {
        this.setState({ errors: error.response.data })
      })

  }

  validateField = (name, value) => {
    const rules = VALIDATION_RULES[name];
    let errors;
    if (rules) {
      if (rules.required) {
        if (!value) {
          errors = rules.required.msg
        }
      }
      if (rules.maxLength) {
        if (value && value.length > rules.maxLength) {
          errors = rules.maxLength.msg
        }
      }
      if (rules.regex) {
        if (!rules.regex.expression.test(value)) {
          errors = rules.regex.msg
        }
      }

      const newErrors = produce(this.state.errors, draft => {
        if (errors) {
          draft[name] = errors
        } else {
          delete draft[name];
        }
      });

      this.setState({ errors: newErrors, pristine: false });
    }
  }

  render() {
    const {
      countries,
      provinces,
      cities,
      errors,
      pristine,
      // Form Data
      name, last_name, email, dni_number, arrival_date, leave_date, help_with, food, is_celiac, country, province, city, vaccinated
    } = this.state;

    return (
      <React.Fragment>
        <AppAppBar />
        <Container maxWidth="md" sx={{ marginTop: 6 }}>
          <Grid container direction="column" spacing={3}>
            <Grid item><Typography variant="h2" color="secondary" align="center">Formulario de inscripción</Typography></Grid>
            <Grid item container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={name}
                  name="name"
                  required
                  error={Boolean(errors.name)}
                  helperText={errors.name || ''}
                  onChange={this.handleOnChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={last_name}
                  name="last_name"
                  required
                  error={Boolean(errors.last_name)}
                  helperText={errors.last_name || ''}
                  onChange={this.handleOnChange}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth label="Email"
                  type="email"
                  value={email}
                  name="email"
                  required
                  error={Boolean(errors.email)}
                  helperText={errors.email || ''}
                  onChange={this.handleOnChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="DNI"
                  value={dni_number}
                  name="dni_number"
                  required
                  error={Boolean(errors.dni_number)}
                  helperText={errors.dni_number || ''}
                  onChange={this.handleOnChange}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={6}>
                <DatePicker
                  fullWidth
                  inputFormat="DD-MM-YYYY"
                  mask="__-__-____"
                  label="Fecha de llegada"
                  value={arrival_date}
                  onChange={this.handleArrivalDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  fullWidth
                  inputFormat="DD-MM-YYYY"
                  mask="__-__-____"
                  label="Fecha de ida"
                  value={leave_date}
                  onChange={this.handleLeaveDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="helpwith-label">Ayuda con</InputLabel>
                  <Select
                    labelId="helpwith-label"
                    id="help_with"
                    name="help_with"
                    value={help_with}
                    label="Ayuda con"
                    onChange={this.handleOnChange}
                  >
                    {
                      HELP_WITH_CHOICES.map((help, i) => (
                        <MenuItem key={`help_with_${i}`} value={help.value}>{help.label}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="food-label">Comida</InputLabel>
                  <Select
                    labelId="food-label"
                    id="food"
                    name="food"
                    value={food}
                    label="Comida"
                    onChange={this.handleOnChange}
                  >
                    {
                      FOOD_CHOICES.map((food, i) => (
                        <MenuItem key={`food_${i}`} value={food.value}>{food.label}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel control={<Checkbox value={is_celiac} onChange={this.handleIsCeliacChange} />} label="Celíaco" />
              </Grid>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={4}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="countries"
                  onChange={this.handleCountryChange}
                  getOptionLabel={(option) => { return option.country_name }}
                  options={countries}
                  value={country}
                  renderInput={(params) => <TextField
                    {...params}
                    label="Pais"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password',
                    }}
                  />
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="provinces"
                  onChange={this.handleProvinceChange}
                  getOptionLabel={(option) => option.province_name}
                  options={provinces}
                  value={province}
                  renderInput={(params) => <TextField
                    {...params}
                    label="Provincia"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password',
                    }}
                  />
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="cities"
                  onChange={this.handleCityChange}
                  getOptionLabel={(option) => option.city_name}
                  options={cities}
                  value={city}
                  renderInput={(params) => <TextField
                    {...params}
                    label="Ciudad"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password',
                    }}
                  />
                  }
                />
              </Grid>
            </Grid>
            <Grid item>
              <FormControlLabel control={<Checkbox value={vaccinated} onChange={this.handleIsVaccinatedChange} />} label="Declaro tener las vacunas al día" />
            </Grid>
            <Grid item>
              <Grid container justifyContent="flex-end">
                <Grid >
                  <Button variant="contained" color="secondary" onClick={this.save} disabled={pristine || Boolean(Object.keys(errors).length) || !vaccinated}>Inscribirme!</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

        </Container>
      </React.Fragment>
    )
  }
}

export default Inscripcion;