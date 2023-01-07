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
    root: {
      fontFamily: 'Montserrat',
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.75
    },
    body1: {
      fontFamily: 'Montserrat',
      fontSize: 14,
      fontWeight: 500
    },
    body2: {
      fontFamily: 'Montserrat',
      fontSize: 14,
      fontWeight: 500
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: 'Montserrat',
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
    }
  }
});

const fontHeader = {
  color: rawTheme.palette.text.primary,
  fontWeight: 500,
  fontFamily: "'Montserrat', sans-serif"
};

const theme = {
  ...rawTheme,
  palette: {
    ...rawTheme.palette,
    background: {
      ...rawTheme.palette.background,
      default: '#ffffff',
      placeholder: grey[200]
    }
  },
  typography: {
    ...rawTheme.typography,
    fontHeader,
    h1: {
      ...rawTheme.typography.h1,
      ...fontHeader,
      letterSpacing: 0,
      fontSize: 60
    },
    h2: {
      ...rawTheme.typography.h2,
      ...fontHeader,
      fontSize: 48
    },
    h3: {
      ...rawTheme.typography.h3,
      ...fontHeader,
      fontSize: 42
    },
    h4: {
      ...rawTheme.typography.h4,
      ...fontHeader,
      fontSize: 36
    },
    h5: {
      ...rawTheme.typography.h5,
      fontSize: 20,
      fontWeight: 300
    },
    h6: {
      ...rawTheme.typography.h6,
      ...fontHeader,
      fontSize: 18
    },
    subtitle1: {
      ...rawTheme.typography.subtitle1,
      fontSize: 20
    },
    body1: {
      ...rawTheme.typography.body2,
      fontWeight: 500,
      fontSize: 16
    },
    body2: {
      ...rawTheme.typography.body1,
      fontSize: 14
    }
  }
};

export default theme;
