import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';

const newTheme = (theme) =>
  createTheme({
    ...theme,
    components: {
      MuiPickersCalendarHeader: {
        styleOverrides: {
          root: {
            color: '#ffffff',
            borderRadius: 0,
            borderWidth: 1,
            borderColor: '#e91e63',
            backgroundColor: '#A82548'
          },
          switchViewIcon: {
            color: '#ffffff'
          }
        }
      },
      MuiDayCalendar: {
        styleOverrides: {
          weekDayLabel: {
            color: '#A82548'
          }
        }
      },
      MuiPickersDay: {
        styleOverrides: {
          root: ({ selected }: { selected: boolean }) => {
            return {
              borderRadius: 15,
              borderWidth: 1,
              borderColor: selected ? '#A82548' : 'transparent',
              border: '1px solid',
              backgroundColor: selected ? '#A82548' : 'transparent',
              color: selected ? '#ffffff' : '#A82548',
              '&:hover': {
                backgroundColor: selected ? '#A82548' : '#A82548',
                color: selected ? '#ffffff' : '#ffffff'
              }
            };
          },
          day: {
            color: '#ffffff'
          }
        }
      },
      MuiPickersMonth: {
        styleOverrides: {
          monthButton: {
            color: '#ad1457',
            borderRadius: 15,
            borderWidth: 1,
            borderColor: '#e91e63',
            border: '1px solid',
            backgroundColor: '#f48fb1'
          }
        }
      },
      MuiPickersYear: {
        styleOverrides: {
          root: {
            color: '#ffffff',
            borderRadius: 15,
            borderWidth: 0,
            borderColor: '#e91e63',
            border: '0px solid',
            backgroundColor: '#A82548'
          }
        }
      }
    }
  });

export default function withRoot(Component) {
  function WithRoot(props) {
    return (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ThemeProvider theme={newTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...props} />
        </ThemeProvider>
      </LocalizationProvider>
    );
  }

  return WithRoot;
}
