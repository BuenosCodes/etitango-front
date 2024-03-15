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
      dark: '#212121'
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
    },
    mainTheme: {
      primary: '#5FB4FC',
      secondary: '#A82548'
    },
    details: {
      frenchBlue: '#0075D9',
      azure: '#4B84DB',
      thistle: '#D8BED8',
      lavender: '#DFEAFF',
      aliceBlue: '#DBEEFF',
      peach: '#FDE4AA',
      perseanOrange: '#E68650'
    },
    status: {
      success: '#91F18B',
      info: '#00639F',
      warning: '#FFD984',
      error: '#FF6F87'
    },
    greyScale: {
      900: '#212121',
      800: '#424242',
      700: '#616161',
      600: '#757575',
      500: '#9E9E9E',
      400: '#BDBDBD',
      300: '#E0E0E0',
      200: '#EEEEEE',
      100: '#F5F5F5',
      50: '#FAFAFA'
    },
    background: {
      floralWhite: '#FFFBF0',
      white: '#FFFFFF'
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
    h5: {
      fontSize: 20
    },
    h6: {
      fontSize: 18
    },
    subtitle1: {
      fontSize: 20
    },
    body: {
      bold: {
        xl: {
          fontFamily: 'Roboto',
          fontSize: '18px',
          fontWeight: 700
        },
        l: {
          fontFamily: 'Roboto',
          fontSize: '16px',
          fontWeight: 700
        },
        m: {
          fontFamily: 'Roboto',
          fontSize: '14px',
          fontWeight: 700
        },
        s: {
          fontFamily: 'Roboto',
          fontSize: '12px',
          fontWeight: 700
        },
        xs: {
          fontFamily: 'Roboto',
          fontSize: '10px',
          fontWeight: 700
        }
      },
      semiBold: {
        xl: {
          fontFamily: 'Roboto',
          fontSize: '18px',
          fontWeight: 600
        },
        l: {
          fontFamily: 'Roboto',
          fontSize: '16px',
          fontWeight: 600
        },
        m: {
          fontFamily: 'Roboto',
          fontSize: '14px',
          fontWeight: 600
        },
        s: {
          fontFamily: 'Roboto',
          fontSize: '12px',
          fontWeight: 600
        },
        xs: {
          fontFamily: 'Roboto',
          fontSize: '10px',
          fontWeight: 600
        }
      },
      medium: {
        xl: {
          fontFamily: 'Roboto',
          fontSize: '18px',
          fontWeight: 500
        },
        l: {
          fontFamily: 'Roboto',
          fontSize: '16px',
          fontWeight: 500
        },
        m: {
          fontFamily: 'Roboto',
          fontSize: '14px',
          fontWeight: 500
        },
        s: {
          fontFamily: 'Roboto',
          fontSize: '12px',
          fontWeight: 500
        },
        xs: {
          fontFamily: 'Roboto',
          fontSize: '10px',
          fontWeight: 500
        }
      },
      regular: {
        xl: {
          fontFamily: 'Roboto',
          fontSize: '18px',
          fontWeight: 400
        },
        l: {
          fontFamily: 'Roboto',
          fontSize: '16px',
          fontWeight: 400
        },
        m: {
          fontFamily: 'Roboto',
          fontSize: '14px',
          fontWeight: 400
        },
        s: {
          fontFamily: 'Roboto',
          fontSize: '12px',
          fontWeight: 400
        },
        xs: {
          fontFamily: 'Roboto',
          fontSize: '10px',
          fontWeight: 400
        }
      }
    }
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
