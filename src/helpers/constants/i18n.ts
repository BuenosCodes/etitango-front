export const SCOPES = {
  COMMON: {
    FORM: 'common.form'
  },
  COMPONENTS: {
    BAR: 'bar',
    FOOTER: 'footer',
    SEARCH_BAR: 'search-bar'
  },
  MODULES: {
    HOME: {
      MAIN: 'home',
      MANIFEST: 'home.manifest',
      HISTORY: 'home.history',
      GENDER: {
        WHO: 'home.gender-who',
        PROT: 'home.gender-prot',
        CONT: 'home.gender-cont'
      }
    },
    SIGN_UP: 'signup',
    SIGN_UP_LIST: 'signup.list',
    SIGN_IN: 'signin',
    USER: 'user',
    PROFILE: 'profile',
    USER_HOME: 'user.home',
    EVENT_LIST: 'event.list',
    INSTRUCTIONS: 'instructions'
  }
};

// prints "Lunes 8 de Enero"
export const argentinaDateFormatter = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long', // Full name of the weekday
  day: 'numeric', // Day of the month as a number
  month: 'long', // Full name of the month
  timeZone: 'America/Argentina/Buenos_Aires' // Specify the timezone
});

export const argentinaDateTimeFormatter = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'America/Argentina/Buenos_Aires',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

export const argentinaCurrencyFormatter = new Intl.NumberFormat(['es-AR', 'es-AR'], {
  style: 'currency',
  currency: 'ARS'
});
