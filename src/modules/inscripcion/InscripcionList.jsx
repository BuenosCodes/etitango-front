import React, {PureComponent} from 'react'

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
import WithAuthentication from "./withAuthentication";
import {getFutureEti} from "../../helpers/firestore/events";
import {getSignups} from "../../helpers/firestore/signups";
import {Translation} from "react-i18next";
import {SCOPES} from "helpers/constants/i18n.ts";

class InscripcionList extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            inscripciones: []
        }
    }

    componentDidMount = async () => {
        const etiEvent = await getFutureEti();
        const inscripciones = await getSignups(etiEvent.id);
        this.setState({inscripciones})
    }

    render() {
        const {inscripciones} = this.state;
        return (
            <Translation ns={SCOPES.MODULES.SIGN_UP_LIST} useSuspense={false}>
                {(t) => (
                    <>
                        <WithAuthentication/>
                        <Container maxWidth="lg" sx={{marginTop: 6}}>
                            <Grid container direction="column" spacing={3}>
                                <Grid item><Typography variant="h2" color="secondary" align="center">
                                    {t("title")}
                                </Typography></Grid>
                                <Grid item>
                                    <TableContainer component={Paper}>
                                        <Table sx={{minWidth: 650}} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left">{t("name")}</TableCell>
                                                    <TableCell align="right">{t("country")}</TableCell>
                                                    <TableCell align="right">{t("province")}</TableCell>
                                                    <TableCell align="right">{t("city")}</TableCell>
                                                    <TableCell align="right">{t("status")}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {inscripciones.map((inscripcion) => (
                                                    <TableRow
                                                        key={inscripcion.nameFirst}
                                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                        style={{background: getBackgroundColor(inscripcion.status_code)}}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {`${inscripcion.nameFirst} ${inscripcion.nameLast}`}
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
                    </>)}
            </Translation>
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