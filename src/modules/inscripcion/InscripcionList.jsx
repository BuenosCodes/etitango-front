import React, {PureComponent} from 'react'
import axios from 'axios';

import {
    Container,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';

class InscripcionList extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            inscripciones: []
        }
    }

    componentDidMount = () => {
        axios.get(`${window.location.protocol}//${process.env.REACT_APP_BACK_END_URL || 'localhost:8000'}/event/inscription/`)
            .then(response => {
                this.setState({inscripciones: response.data.inscriptions})
            })
            .catch(e => {
                console.error(e);
            })
    }

    render() {
        const {inscripciones} = this.state;

        return (
            <React.Fragment>
                <Container maxWidth="lg" sx={{marginTop: 6}}>
                    <Grid container direction="column" spacing={3}>
                        <Grid item><Typography variant="h2" color="secondary" align="center">
                            Listado de Inscripciones
                        </Typography></Grid>
                        <Grid item>
                            <TableContainer component={Paper}>
                                <Table sx={{minWidth: 650}} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">Nombre</TableCell>
                                            <TableCell align="right">Pais</TableCell>
                                            <TableCell align="right">Provincia</TableCell>
                                            <TableCell align="right">Ciudad</TableCell>
                                            <TableCell align="right">Estado de la inscripción</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {inscripciones.map((inscripcion) => (
                                            <TableRow
                                                key={inscripcion.name}
                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                style={{background: getBackgroundColor(inscripcion.status_code)}}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {`${inscripcion.name} ${inscripcion.last_name}`}
                                                </TableCell>
                                                <TableCell align="right">{inscripcion.country}</TableCell>
                                                <TableCell align="right">{inscripcion.province}</TableCell>
                                                <TableCell align="right">{inscripcion.city}</TableCell>
                                                <TableCell align="right">{inscripcion.status}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Container>
            </React.Fragment>
        )
    }
}

function getBackgroundColor(status_code) {

    const colorYellow = 'rgba(255,242,0,0.5)';
    const colorOrange = 'rgba(255,124,0,0.5)';
    const colorRed = 'rgba(255,0,20,0.4)';
    const colorBeige = '#ffe4c4';
    const colorGreen = 'rgba(85,204,0,0.5)';
    switch (status_code) {
        case 'A':
        case 'G': // Aprobado
            return colorGreen
        case 'W': // lista de espera
            return colorBeige
        case 'E': // Pendiente de Aprobación
            return colorYellow
        case 'C': // Cancelado
            return colorRed
        case 'D': //Pago demorado
            return colorOrange
        default:
            return "white";
    }
}


export default InscripcionList;