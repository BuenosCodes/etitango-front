import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { GlobalStateProvider } from 'helpers/UserPanelContext';
import moment from 'moment';
import 'moment/locale/es';
moment.lang('es', {
  months:
    'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
      '_'
    )
});

export default function withRoot(Component) {
  function WithRoot(props) {
    return (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ThemeProvider theme={theme}>
          <GlobalStateProvider>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...props} />
          </GlobalStateProvider>
        </ThemeProvider>
      </LocalizationProvider>
    );
  }

  return WithRoot;
}
