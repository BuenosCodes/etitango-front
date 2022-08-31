import * as React from 'react';
// import cronograma from "../cronograma.json";
import { Box, Button, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SCOPES } from 'helpers/constants/i18n.ts';

// const number = {
//   fontSize: 24,
//   fontFamily: "default",
//   color: "secondary.main",
//   fontWeight: "medium",
//   paddingLeft: 2,
// };

// eslint-disable-next-line no-undef
const ImgBackground = process.env.PUBLIC_URL + '/img/logo/eti-currentEvent.jpg';

function Cronograma() {
  const { t } = useTranslation(SCOPES.MODULES.HOME.MAIN, { useSuspense: false });
  return (
    <Box component="section" sx={{ display: 'flex', overflow: 'hidden' }}>
      <Grid
        container
        sx={{
          my: 5,
          me: 10,
          position: 'relative'
        }}
        spacing={3}
        direction="column"
        align="center">
        {/*<Grid item><Typography variant="h4" marked="center" component="h2">*/}
        {/*  Cronograma ETIano*/}
        {/*</Typography></Grid>*/}
        <Grid item>
          <img src={ImgBackground} alt="logo" height="100%" width="100%" />
        </Grid>
        {/*<Grid item>
          <Grid container spacing={3} mt={6} px={15}>
            {cronograma.dias.map((dia, index) => (
              <Grid item key={`cronograma_${index}`} xs={12} md={4}>
                <Paper sx={{ padding: "24px", height: "100%" }}>
                  <Box sx={number}>{dia.dia}</Box>
                  <List>
                    {dia.actividades.map((actividad) => (
                      <ListItem>
                        <ListItemText primary={actividad} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>*/}
        <Grid item>
          <Button
            color="secondary"
            size="large"
            variant="contained"
            component="a"
            href="/inscripcion/">
            {t('signUp')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Cronograma;
