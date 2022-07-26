import React, {PureComponent} from 'react'
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {
    Autocomplete,
    Button,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {produce} from 'immer';
import {debounce} from 'debounce';
import {FOOD_CHOICES, HELP_WITH_CHOICES, VALIDATION_RULES} from './inscripcion.constants';
import WithAuthentication from "./withAuthentication";
import {createSignup} from "../../helpers/firestore/signups";
import {getCities, getProvinces} from "../../helpers/thirdParties/georef";
import {getCountries} from "../../helpers/thirdParties/restCountries";

class Inscripcion extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            provinces: [],
            cities: [],
            errors: {},
            pristine: true,
            //FormData
            name: "",
            last_name: "",
            email: "",
            dni_number: "",
            status: "W",
            arrival_date: "2022-07-8",
            leave_date: "2022-07-10",
            help_with: "",
            food: "",
            is_celiac: false,
            vaccinated: true,
            country: null,
            province: null,
            city: null
        };
    }

    componentDidMount = async () => {
        try {
            const countries = await getCountries();
            this.setState({countries});
        } catch (e) {
            console.error(e)
        }
    }

    handleOnChange = ({target}) => {
        this.setState({[target.name]: target.value})
        debounce(this.validateField(target.name, target.value), 500);
    }

    handleArrivalDateChange = (newValue) => {
        if (!newValue) return
        this.setState({arrival_date: `${newValue.year()}-${newValue.month() + 1}-${newValue.date()}`})
    }

    handleLeaveDateChange = (newValue) => {
        if (!newValue) return
        this.setState({leave_date: `${newValue.year()}-${newValue.month() + 1}-${newValue.date()}`})
    }

    handleIsCeliacChange = (e, is_celiac) => {
        this.setState({is_celiac})
    }

    // handleIsVaccinatedChange = (e, vaccinated) => {
    //   this.setState({ vaccinated })
    // }

    handleCountryChange = async (e, value) => {
        const isArgentina = value === 'Argentina';
        const provinces = isArgentina ? await getProvinces() : []
        this.setState({provinces, province: null, city: null, country: value, isArgentina})
    }

    handleProvinceChange = async (e, value) => {
        const cities = value ? await getCities(value) : []
        this.setState({cities, province: value, city: null})
    }

    handleCityChange = (e, value) => {
        if (!value) return;
        this.setState({city: value})
    }

    save = async () => {
        const {
            name,
            last_name,
            email,
            dni_number,
            arrival_date,
            leave_date,
            help_with,
            food,
            is_celiac,
            country,
            province,
            city
        } = this.state;
        let data = {
            name,
            last_name,
            email,
            dni_number,
            arrival_date,
            leave_date,
            help_with: help_with,
            food: food,
            is_celiac,
            country: (country && country.id) || null,
            province: (province && province.id) || null,
            city: (city && city.id) || null
        };
        if (!country)
            delete data.country;
        if (!province)
            delete data.province;
        if (!city)
            delete data.city;

        try {
            await createSignup(data)
            window.location.href = `${window.location.protocol}//${process.env.REACT_APP_FRONT_END_URL || 'localhost:3000'}/lista-inscriptos`;
        } catch (error) {
            this.setState({errors: error.response.data})
        }

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

            this.setState({errors: newErrors, pristine: false});
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
            name,
            last_name,
            email,
            dni_number,
            arrival_date,
            leave_date,
            help_with,
            food,
            is_celiac,
            country,
            province,
            city,
            vaccinated
        } = this.state;

        return (
            <React.Fragment>
                <WithAuthentication redirectUrl={'inscripcion'}/>
                <Container maxWidth="lg" sx={{marginTop: 6}}>
                    <Grid container direction="column" spacing={3}>
                        <Grid item>
                            <Typography variant="h2" color="secondary" align="center">
                                Formulario de inscripción
                            </Typography>
                        </Grid>
                        <Grid item container spacing={2} md={6} sm={12}>
                            <Grid item md={6} sm={6} xs={12}>
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
                            <Grid item md={6} sm={6} xs={12}>
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
                        <Grid item container spacing={2} md={6} sm={12}>
                            <Grid item md={6} sm={6} xs={12}>
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
                            <Grid item md={6} sm={6} xs={12}>
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
                        <Grid item container spacing={2} md={6} sm={12}>
                            <Grid item md={6} sm={6} xs={6}>
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
                            <Grid item md={6} sm={6} xs={6}>
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
                        <Grid item container spacing={2} md={6} sm={12}>
                            <Grid item md={4} sm={4} xs={12}>
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
                                                <MenuItem key={`help_with_${i}`}
                                                          value={help.value}>{help.label}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={4} xs={12}>
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
                            <Grid item md={4} sm={4} xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value={is_celiac} onChange={this.handleIsCeliacChange}/>}
                                    label="Celíaco"/>
                            </Grid>
                        </Grid>
                        <Grid item container spacing={2} md={6} sm={12}>
                            <Grid item md={4} sm={4} xs={12}>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="countries"
                                    onChange={this.handleCountryChange}
                                    options={countries}
                                    value={country}
                                    renderInput={(params) => <TextField
                                        {...params}
                                        label="Pais"
                                        inputProps={params.inputProps}
                                    />
                                    }
                                />
                            </Grid>
                            {this.state.isArgentina && <>
                            <Grid item md={4} sm={4} xs={12}>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="provinces"
                                    onChange={this.handleProvinceChange}
                                    options={provinces}
                                    value={province}
                                    renderInput={(params) => <TextField
                                        {...params}
                                        label="Provincia"
                                        inputProps={params.inputProps}
                                    />
                                    }
                                />
                            </Grid>
                            <Grid item md={4} sm={4} xs={12}>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="cities"
                                    onChange={this.handleCityChange}
                                    options={cities}
                                    value={city}
                                    renderInput={(params) => <TextField
                                        {...params}
                                        label="Ciudad"
                                        inputProps={params.inputProps}
                                    />
                                    }
                                />
                            </Grid>
                            </>}
                        </Grid>
                        {/*<Grid item container alignItems="center">
              <Grid item xs={1}>
                <Checkbox size="large" value={vaccinated} onChange={this.handleIsVaccinatedChange} />
              </Grid>
              <Grid item xs={11}>
                <Typography color="error">"*Declaro que cuento con esquema de vacunación covid completo (2 o más dosis) o, en caso contrario, me comprometo a realizarme y presentar un diagnóstico por PCR hasta 48hs antes del ETI que deberá ser negativo para poder asistir al encuentro.
                  Declaro entender que de no cumplir con lo anterior se me negará la entrada al encuentro y no se me devolverá el dinero del combo."</Typography>
              </Grid>
            </Grid>*/}
                        <Grid item container
                              justifyContent={"center"}
                        >
                            <Grid item style={{textAlign: 'center'}} justifyContent={'center'}>
                                <Typography variant="h3" color="primary" align="center">
                                    Combo
                                </Typography>
                                <Typography>Hasta el 9/6: $3500</Typography>
                                <Typography>Después del 9/6: $4000</Typography>
                            </Grid>

                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Button variant="contained" color="secondary" onClick={this.save}
                                            disabled={pristine || Boolean(Object.keys(errors).length) || !vaccinated}>Inscribirme!</Button>
                                </Grid>
                            </Grid>
                            <Grid item style={{textAlign: 'center'}}>
                                <Typography variant="caption">
                                    * Si por alguna razón no podés asistir al ETI,
                                    tenés tiempo de pedir la devolución de tu combo hasta 10 días antes del ETI,
                                    es decir, hasta el <b>martes 28 de junio</b>.<br/>
                                    Pasada esa fecha, no se te devolverá tu dinero aunque no asistas al ETI.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                </Container>
            </React.Fragment>
        )
    }
}

export default Inscripcion;