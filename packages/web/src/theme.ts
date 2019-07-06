import {
  createMuiTheme,
  responsiveFontSizes,
  Theme,
} from '@material-ui/core/styles';
const montserrat = require('typeface-montserrat');

const themeObj = {
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
    link: {
      main: '#0365D6',
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
  Overrides: {
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
};

const theme = responsiveFontSizes(createMuiTheme(themeObj));

export const errorTheme = (outerTheme: Theme) =>
  ({
    ...outerTheme,
    palette: {
      primary: outerTheme.palette.error,
    },
  } as Theme);

export const successTheme = responsiveFontSizes(
  createMuiTheme({
    ...themeObj,
    palette: {
      ...themeObj.palette,
      primary: {
        main: '#4CAF50',
      },
    },
  })
);

export const washedTheme = responsiveFontSizes(
  createMuiTheme({
    ...themeObj,
    palette: {
      ...themeObj.palette,
      primary: {
        main: '#EEF0F8',
      },
    },
  })
);

export const linkColor: string = '#0365D6';

export default theme;
