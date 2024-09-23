import * as React from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import { SCOPES } from 'helpers/constants/i18n';
import { ROUTES } from '../../../App';
import { EtiEventContext } from 'helpers/EtiEventContext';

const number = {
  fontSize: 24,
  fontFamily: 'default',
  color: 'secondary.main',
  fontWeight: 'medium',
  paddingLeft: 2
};

function Cronograma() {
  const { t } = useTranslation(SCOPES.MODULES.HOME.MAIN, { useSuspense: false });
  const { etiEvent } = useContext(EtiEventContext);

  return (
    <>
      {!etiEvent?.id ? (
        <CircularProgress />
      ) : (
        <Box component="section" sx={{ display: 'flex', overflow: 'hidden' }}>
          <Grid
            container
            sx={{
              my: 5,
              me: 10
            }}
            spacing={3}
            direction="column"
            align="center"
          >
            <Grid item>
              <Typography variant="h4" marked="center" component="h2">
                Cronograma ETIano
              </Typography>
            </Grid>
            <Grid item mt={3} px={5}>
              {etiEvent?.locations.map(({ name, link }) => (
                <Typography variant="h6" key={name}>
                  {name}
                  <Link href={link}>
                    <Typography>(Ver en Mapa Aquí)</Typography>
                  </Link>
                </Typography>
              ))}
              <Grid container spacing={3} px={5} mt={3}>
                {etiEvent?.schedule.map(({ title, activities }, index) => (
                  <Grid item key={`cronograma_${index}`} xs={12} md={etiEvent?.schedule.length === 3 ? 4 : 6}>
                    <Paper sx={{ padding: '24px', height: '100%' }}>
                      <Box sx={number}>
                        <Typography>{title}</Typography>
                      </Box>
                      <List>
                        {activities.split('\n').map((actividad, i) => (
                          <ListItem key={i}>
                            <ListItemText primary={actividad} />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item>
              <Button color="secondary" size="large" variant="contained" href={ROUTES.USER_HOME}>
                {t('signUp').toUpperCase()}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}

export default Cronograma;
