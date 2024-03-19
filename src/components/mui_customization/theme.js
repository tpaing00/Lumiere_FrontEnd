import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  breakpoints: {
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
      light: '#87bbd7',
      main: '#87bbd7',
      dark: '#003c5c',
      button: '132f3e',
      contrastText: '#000',
    },
    accent: {
      main: '#f26419'
    },
    success: {
      main: '#277c5e'
    },
    error: {
      main: '#962600'
    },
    text: {
      body: '#292929',
      placeholder: '#6a6a6a'
    },
    environment: {
      stroke: '#919191',
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
      color: '#003c5c',
    },
    h2: {
      fontFamily: 'Roboto Condensed',
      fontSize: 28,
      fontWeight: 700,
      color: '#003c5c',
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
    fontFamily: 'Outfit',
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: '12px',
          boxShadow: 'none',
          fontSize: '16px',
          fontWeight: 'normal',
          height: '48px',
          margin: '10px',
          padding: '6px 16px',
          textTransform: 'none',
          width: '288px',
        },
      },
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            backgroundColor: '#fdcb2a',
            color: '#003c5c',
            '&:hover': {
              backgroundColor: '#fdcb2a',
              boxShadow: 'none'
            },
            '&:active': {
              backgroundColor: '#f5b02c',
              boxShadow: 'none'
            },
            '&:disabled': {
              backgroundColor: '#dfdfdf',
              color: '#919191',
            },
          },
        },
        {
          props: { variant: 'outlined' },
          style: {
            backgroundColor: '#fcfcfc',
            border: '1.5px solid #003c5c',
            color: '#003c5c',
            '&:hover': {
              backgroundColor: '#fcfcfc',
              border: '1.5px solid #003c5c',
              boxShadow: 'none'
            },
            '&:active': {
              backgroundColor: '#d3e5ed',
              boxShadow: 'none'
            },
            '&:disabled': {
              backgroundColor: '#dfdfdf',
              border: '1.5px solid #6a6a6a',
              color: '#6a6a6a',
            },
          },
        },
        {
          props: { variant: 'floating' },
          style: {
            backgroundColor: '#003c5c',
            border: 'none',
            boxShadow: '0 4px 4px rgb(0, 53, 82, 0.2)',
            color: '#fcfcfc',
            '&:hover': {
              backgroundColor: '#003c5c',
              border: 'none',
              boxShadow: '0 4px 4px rgb(0, 53, 82, 0.2)',
            },
            '&:active': {
              backgroundColor: '#132f3e',
              border: 'none',
              boxShadow: '0 4px 4px rgb(0, 53, 82, 0.2)',
            },
            '&:disabled': {
              backgroundColor: '#dfdfdf',
              border: 'none',
              color: '#919191',
            },
          },
        },
      ],
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          margin: 0,
          padding: 0,
        }
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          textAlign: 'left',
          color: '#292929',
          fontSize: '16px',
          fontWeight: 'normal',
          martingTop: '16px'
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          display: 'flex',
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#f5b02c',
                borderColor: '#f5b02c',
              },
            },
          },
          '& .MuiSwitch-thumb': {
            width: 22,
            height: 22,
            boxShadow: 'none',
          },
          '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            opacity: 1,
            backgroundColor: '#6a6a6a',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
       input: {
         border: '1px solid #919191',
         borderRadius: '4px',
         padding: '12px 16px',
         width: '100%',
         '&::placeholder': {
           color: '6a6a6a',
          },
          '&:focused': {
           border: '2x solid #003c5c',
           color: '#292929',
         },
        },

      },
    },
  },
});

export default theme;
