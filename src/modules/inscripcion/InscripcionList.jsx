import React, { PureComponent } from 'react';

import {
  Button,
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
import WithAuthentication from './withAuthentication';
import { getFutureEti } from '../../helpers/firestore/events';
import { getSignups } from '../../helpers/firestore/signups';
import { Translation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';
import { CSVLink } from 'react-csv';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import {
  CELIAC_CHOICES,
  FOOD_CHOICES,
  getLabelForValue,
  HELP_WITH_CHOICES
} from './inscripcion.constants.js';

class InscripcionList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inscripciones: []
    };
  }

  componentDidMount = async () => {
    const etiEvent = await getFutureEti();
    const inscripciones = await getSignups(etiEvent.id);
    this.setState({ inscripciones });
  };

  render() {
    const { inscripciones } = this.state;
    const exportableData =
      inscripciones?.map((signUp) => ({
        ...signUp,
        dateArrival: signUp.dateArrival.toLocaleDateString(),
        dateEnd: signUp.dateEnd.toLocaleDateString(),
        dateDeparture: signUp.dateDeparture.toLocaleDateString(),
        isCeliac: getLabelForValue(CELIAC_CHOICES, signUp.isCeliac),
        helpWith: getLabelForValue(HELP_WITH_CHOICES, signUp.helpWith),
        food: getLabelForValue(FOOD_CHOICES, signUp.food)
      })) || [];
    const exportableDataHeaders = inscripciones
      ?.map((signUp) => Object.keys(signUp))
      .reduce((previous, current) => previous.concat(current), [])
      .filter((column, index, array) => array.indexOf(column) === index);
    const today = new Date();
    const date = `${today.getDay()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    return (
      <Translation ns={[SCOPES.MODULES.SIGN_UP_LIST, SCOPES.COMMON.FORM]} useSuspense={false}>
        {(t) => (
          <>
            <WithAuthentication />
            <Container maxWidth="lg" sx={{ marginTop: 6 }}>
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <Typography variant="h2" color="secondary" align="center">
                    {t('title')}
                  </Typography>
                </Grid>
                <Grid item>
                  <TableContainer component={Paper}>
                    <Grid
                      item
                      container
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center">
                      <CSVLink
                        headers={exportableDataHeaders.map((header) => ({
                          key: header,
                          label: t(header, { ns: SCOPES.COMMON.FORM })
                        }))}
                        data={exportableData}
                        filename={t('exportFilename', { date })}>
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<FileDownloadIcon />}>
                          {t('export')}
                        </Button>
                      </CSVLink>
                    </Grid>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">{t('name')}</TableCell>
                          <TableCell align="right">{t('country')}</TableCell>
                          <TableCell align="right">{t('province')}</TableCell>
                          <TableCell align="right">{t('city')}</TableCell>
                          <TableCell align="right">{t('status')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {inscripciones.map((inscripcion) => (
                          <TableRow
                            key={inscripcion.nameFirst}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            style={{ background: getBackgroundColor(inscripcion.status_code) }}>
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
          </>
        )}
      </Translation>
    );
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
      return colorGreen;
    case 'W': // lista de espera
      return colorBeige;
    case 'E': // Pendiente de Aprobación
      return colorYellow;
    case 'C': // Cancelado
      return colorRed;
    case 'D': //Pago demorado
      return colorOrange;
    default:
      return 'white';
  }
}

export default InscripcionList;
