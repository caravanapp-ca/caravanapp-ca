import {
  createMuiTheme,
  responsiveFontSizes,
  Theme,
} from '@material-ui/core/styles';
import { PaletteObject } from '@caravan/buddy-reading-types';
import { TypeText } from '@material-ui/core/styles/createPalette';
const montserrat = require('typeface-montserrat');

export const themeObj = {
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

export const theme = responsiveFontSizes(createMuiTheme(themeObj));

export const errorTheme = responsiveFontSizes(
  createMuiTheme({
    ...themeObj,
    palette: {
      ...themeObj.palette,
      primary: {
        main: theme.palette.error.main,
      },
    },
  })
);

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

export const textSecondaryTheme = responsiveFontSizes(
  createMuiTheme({
    ...themeObj,
    palette: {
      ...themeObj.palette,
      primary: {
        main: theme.palette.text.secondary,
      },
    },
  })
);

export const paletteColours: PaletteObject[] = [
  { key: '#FFFFFF', textColor: 'primary' },
  { key: '#5c6bc0', textColor: 'white' },
  { key: '#f44336', textColor: 'primary' },
  { key: '#e91e63', textColor: 'primary' },
  { key: '#9c27b0', textColor: 'white' },
  { key: '#673ab7', textColor: 'white' },
  { key: '#3f51b5', textColor: 'white' },
  { key: '#2196f3', textColor: 'primary' },
  { key: '#03a9f4', textColor: 'primary' },
  { key: '#00bcd4', textColor: 'primary' },
  { key: '#009688', textColor: 'primary' },
  { key: '#4caf50', textColor: 'primary' },
  { key: '#8bc34a', textColor: 'primary' },
  { key: '#cddc39', textColor: 'primary' },
  { key: '#ffeb3b', textColor: 'primary' },
  { key: '#ffc107', textColor: 'primary' },
  { key: '#ff9800', textColor: 'primary' },
  { key: '#ff5722', textColor: 'primary' },
  { key: '#795548', textColor: 'white' },
  { key: '#9e9e9e', textColor: 'primary' },
  { key: '#607d8b', textColor: 'white' },
];

export const makeUserTheme = (palette: PaletteObject | null) => {
  if (palette) {
    return responsiveFontSizes(
      createMuiTheme({
        ...theme,
        palette: {
          ...theme.palette,
          primary: {
            main: palette.key,
          },
        },
      })
    );
  }
  return undefined;
};

export const makeUserDarkTheme = (palette: PaletteObject | null) => {
  if (palette) {
    const userTextColors = getUserTextPalette(palette);
    return responsiveFontSizes(
      createMuiTheme({
        ...theme,
        palette: {
          ...theme.palette,
          primary: {
            main: userTextColors.primary,
          },
          text: userTextColors,
        },
      })
    );
  }
  return undefined;
};

const getUserTextPalette = (palette: PaletteObject) => {
  const opacities = {
    primary: 0.87,
    secondary: 0.54,
    disabled: 0.38,
    hint: 0.38,
  };
  switch (palette.textColor) {
    case 'primary':
      const primaryText: TypeText = {
        primary: `rgba(0, 0, 0, ${opacities.primary})`,
        secondary: `rgba(0, 0, 0, ${opacities.secondary})`,
        disabled: `rgba(0, 0, 0, ${opacities.disabled})`,
        hint: `rgba(0, 0, 0, ${opacities.hint})`,
      };
      return primaryText;
    case 'white':
      const whiteText: TypeText = {
        primary: `rgba(255, 255, 255, ${opacities.primary})`,
        secondary: `rgba(255, 255, 255, ${opacities.secondary})`,
        disabled: `rgba(255, 255, 255, ${opacities.disabled})`,
        hint: `rgba(255, 255, 255, ${opacities.hint})`,
      };
      return whiteText;
    default:
      return theme.palette.text;
  }
};

export const linkColor: string = '#0365D6';

export default theme;
