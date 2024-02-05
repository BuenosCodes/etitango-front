import { createTheme } from '@mui/material/styles';
import { green, grey, red } from '@mui/material/colors';

const rawTheme = createTheme({
  palette: {
    primary: {
      light: '#69696a',
      main: '#28282a',
      dark: '#1e1e1f'
    },
    secondary: {
      light: '#bbdefb',
      main: '#2196f3',
      dark: '#1A0D3F'
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
    fontFamily: 'Montserrat',
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
    h4b: {
      fontSize: 24
    },
    h5: {
      fontSize: 20
    },
    h6: {
      fontSize: 18
    },
    h7: {
      fontSize: 14
    },
    subtitle1: {
      fontSize: 20
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
