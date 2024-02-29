import { createTheme } from '@mui/material/styles';
import { green, grey, red } from '@mui/material/colors';

const rawTheme = createTheme({
  palette: {
    primary: {
      light: '#5FB4FC',
      main: '#4B84DB',
      dark: '#1e1e1f',
    },
    secondary: {
      light: '#bbdefb',
      main: '#2196f3',
      dark: '#1A0D3F'
    },
    listItems: {
      light: '#FAFAFA',
      main: '#FFFBF0',
      dark: '#212121'
    },
    iconButtons: {
      main: '#FFFFFF'
    },
    warning: {
      main: '#ffc071',
      dark: '#ffb25e'
    },
    error: {
      light: red[50],
      main: red[500],
      dark: red[700]
    },
    success: {
      light: green[50],
      main: green[500],
      dark: green[700]
    }
  },
  typography: {
    fontFamily: 'Montserrat, "Work Sans", "Roboto", sans-serif',
    lineHeight: '24px',
    letterSpacing: '-0.015em',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: 60
    },
    h2: {
      fontSize: 48
    },
    h3: {
      fontSize: 42
    },
    h4: {
      fontSize: 36
    },
    h5: {
      fontSize: 20
    },
    h6: {
      fontSize: 18
    },
    subtitle1: {
      fontSize: 20
    },
    robotoFont: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: 20,
      fontWeight: 400,
     
    },
    robotoFont2: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: 14
      
    },
    robotoFont3: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: 16
      
    },
    workSansFont: {
      fontFamily: 'Work Sans, sans-serif',
      fontSize:'24px'
    },
    workSansFont2: {
      fontFamily: 'Work Sans, sans-serif',
      fontSize:'16px'
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: 12,
          align: 'center',
          margin: '3px',
          textAlign: 'center'
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          fontSize: 16
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontWeight: 'bold'
        }
      }
    }
  }
});

const theme = {
  ...rawTheme,
  palette: {
    ...rawTheme.palette,
    background: {
      ...rawTheme.palette.background,
      default: '#ffffff',
      placeholder: grey[200]
    }
  }
};

export default theme;
