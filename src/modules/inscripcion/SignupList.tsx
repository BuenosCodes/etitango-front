import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { Translation } from 'react-i18next';

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
import { SCOPES } from 'helpers/constants/i18n';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import {
  CELIAC_CHOICES,
  FOOD_CHOICES,
  getLabelForValue,
  HELP_WITH_CHOICES
} from './inscripcion.constants.js';
import { Signup, SignupStatus } from '../../shared/signup';

const SignupList = () => {
  const [signups, setSignups] = useState([] as Signup[]);

  useEffect(() => {
    const getInscripciones = async () => {
      const etiEvent = await getFutureEti();
      const signups = await getSignups(etiEvent.id);
      setSignups(signups);
    };
    getInscripciones();
  }, []);

  const exportableData =
    signups?.map((signUp) => ({
      ...signUp,
      dateArrival: signUp.dateArrival.toLocaleDateString(),
      dateDeparture: signUp.dateDeparture.toLocaleDateString(),
      isCeliac: getLabelForValue(CELIAC_CHOICES, signUp.isCeliac),
      helpWith: getLabelForValue(HELP_WITH_CHOICES, signUp.helpWith),
      food: getLabelForValue(FOOD_CHOICES, signUp.food)
    })) || [];

  const exportableDataHeaders = signups
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
                    alignItems="center"
                  >
                    <CSVLink
                      headers={exportableDataHeaders.map((header) => ({
                        key: header,
                        label: t(header, { ns: SCOPES.COMMON.FORM })
                      }))}
                      data={exportableData}
                      filename={t('exportFilename', { date })}
                    >
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<FileDownloadIcon />}
                      >
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
                      {signups.map((signup) => (
                        <TableRow
                          key={signup.nameFirst}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          style={{ background: getBackgroundColor(signup.status) }}
                        >
                          <TableCell component="th" scope="row">
                            {`${signup.nameFirst} ${signup.nameLast}`}
                          </TableCell>
                          <TableCell align="right">{signup.country}</TableCell>
                          <TableCell align="right">{signup.province}</TableCell>
                          <TableCell align="right">{signup.city}</TableCell>
                          <TableCell align="right">{signup.status}</TableCell>
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
};

function getBackgroundColor(status?: SignupStatus) {
  const colorYellow = 'rgba(255,242,0,0.5)';
  const colorOrange = 'rgba(255,124,0,0.5)';
  const colorRed = 'rgba(255,0,20,0.4)';
  const colorBeige = '#ffe4c4';
  const colorGreen = 'rgba(85,204,0,0.5)';
  switch (status) {
    case SignupStatus.CONFIRMED:
      return colorGreen;
    case SignupStatus.WAITLIST: // lista de espera
      return colorBeige;
    case SignupStatus.PAYMENT_PENDING: // Pendiente de Aprobación
      return colorYellow;
    case SignupStatus.CANCELLED: // Cancelado
      return colorRed;
    case SignupStatus.PAYMENT_DELAYED: //Pago demorado
      return colorOrange;
    default:
      return 'white';
  }
}

export default SignupList;
