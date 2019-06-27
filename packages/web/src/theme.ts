import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
const montserrat = require('typeface-montserrat');

const theme = responsiveFontSizes(
  // @ts-ignore
  createMuiTheme({
    palette: {
      primary: {
        main: '#5C6BC0',
        light: '#8E99F3',
        dark: '#26418F',
      },
      secondary: {
        main: '#FFF176',
        light: '#FFFFA8',
        dark: '#CABF45',
      },
      error: {
        main: '#B00020',
      },
    },
    typography: {
      fontFamily: [
        'Montserrat',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '@font-face': [montserrat],
        },
      },
      MuiTypography: {
        button: {
          fontWeight: 600,
        },
      },
    },
  })
);

export default theme;
