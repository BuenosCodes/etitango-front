import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { Translation } from 'react-i18next';

import { Button, Container, Grid, Paper, TableContainer, Typography } from '@mui/material';
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
import { Signup } from '../../shared/signup';
import { SignupListTable } from './SignupListTable';

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
                  <SignupListTable signups={signups} />
                </TableContainer>
              </Grid>
            </Grid>
          </Container>
        </>
      )}
    </Translation>
  );
};

export default SignupList;
