import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  breakpoints: {
    // Define the lg screen breakpoint to be 1440px
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1440,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      light: '#fcdda3',
      main: '#f5b02c',
      dark: '#a8730f',
      button: '#fdcb2a',
      contrastText: '#fff',
    },
    secondary: {
      light: '#daedf5',
      main: '#87bbd7',
      dark: '#003c5c',
      buttonPressed: '132f3e',
      contrastText: '#000',
    },
    accent: {
      main: '#f26419'
    },
    success: {
      main: '#277c5e'
    },
    error: {
      main: '#aa230e'
    },
    text: {
      primary: '#292929',
      placeholder: '#6a6a6a'
    },
    environment: {
      fieldStroke: '#919191',
      neutral: '#dfdfdf',
      neutralLight: '#f2f2f2',
      white: '#fcfcfc',
      background: '#f5f4f1'
    },
    background: {
      paper: '#fcfcfc',
      default: '#fcfcfc',
    }
  },
  typography: {
    h1: {
      fontFamily: 'Roboto Condensed',
      fontSize: '30px',
      '@media (min-width:1440px)': {
        fontSize: '38px',
      },
      fontWeight: 700,
      letterSpacing: '-1.5px',
    },
    h2: {
      fontFamily: 'Roboto Condensed',
      fontSize: 28,
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Roboto Condensed',
      fontSize: 18,
      fontWeight: 700,
    },
    body1: {
      fontFamily: 'Outfit',
      fontSize: 16,
    },
    body2: {
      fontFamily: 'Outfit',
      fontSize: 14,
    },
    button: {
      fontFamily: 'Outfit',
      fontSize: 16,
    },
    caption: {
      fontFamily: 'Outfit',
    },
    overline: {
      fontFamily: 'Outfit',
    },
    subtitle1: {
      fontFamily: 'Outfit',
    },
    subtitle2: {
      fontFamily: 'Outfit',
    },
  },
});

export default theme