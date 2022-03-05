import { DatePicker } from '@mui/lab';
import { Autocomplete, Button, Checkbox, Container, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import React, { Component } from 'react'
import AppAppBar from '../../components/AppAppBar';

import { HELP_WITH_CHOICES, FOOD_CHOICES } from './inscripcion.constants';

class Inscripcion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      allProvinces: [],
      provinces: [],
      allCities: [],
      cities: [],
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
      country: null,
      province: null,
      city: null
    };
  }

  componentDidMount = async () => {
    try {
      const locations = Promise.all([
        axios.get('http://localhost:8000/location/countries/'),
        axios.get('http://localhost:8000/location/provinces/'),
        axios.get('http://localhost:8000/location/cities/')
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
          console.error(e);

        })

    } catch (e) {
    }
  }

  handleOnChange = ({ target }) => {
    this.setState({ [target.name]: target.value })
  }

  handleArrivalDateChange = (newValue) => {
    this.setState({ arrival_date: `${newValue.year()}-${newValue.month() + 1}-${newValue.date()}` })
  }

  handleLeaveDateChange = (newValue) => {
    this.setState({ leave_date: `${newValue.year()}-${newValue.month() + 1}-${newValue.date()}` })
  }

  handleIsCeliacChange = (e, is_celiac) => {
    this.setState({ is_celiac })
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
    const isValid = this.validateForm();
    const { name, last_name, email, dni_number, arrival_date, leave_date, help_with, food, is_celiac, country, province, city } = this.state;

    if (isValid) {
      axios.post('http://localhost:8000/event/inscription/', {
        name,
        last_name,
        email,
        dni_number,
        arrival_date,
        leave_date,
        help_with: help_with.value,
        food: food.value,
        is_celiac,
        country: country.id,
        province: province.id,
        city: city.id
      })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.error(error);
        })
    }
  }

  validateForm = () => {
    return true;
  }

  render() {
    const {
      countries,
      provinces,
      cities,
      // Form Data
      name, last_name, email, dni_number, arrival_date, leave_date, help_with, food, is_celiac, country, province, city
    } = this.state;

    return (
      <React.Fragment>
        <AppAppBar />
        <Container maxWidth="md" sx={{ marginTop: 2 }}>
          <Grid container direction="column" spacing={3}>
            <Grid item container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={name}
                  name="name"
                  onChange={this.handleOnChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={last_name}
                  name="last_name"
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
                  onChange={this.handleOnChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="DNI"
                  value={dni_number}
                  name="dni_number"
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
                    <MenuItem value={undefined}></MenuItem>
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
                    <MenuItem value={undefined}></MenuItem>
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
              <Grid container justifyContent="flex-end">
                <Grid >
                  <Button variant="contained" color="secondary" onClick={this.save}>Inscribirme!</Button>
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