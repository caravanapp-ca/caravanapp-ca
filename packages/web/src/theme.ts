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
  // White
  { key: '#FFFFFF', textColor: 'primary' },
  // Caravan Blurple
  { key: '#5c6bc0', textColor: 'white' },
  // Red
  { key: '#f44336', textColor: 'white' },
  // Pink
  { key: '#e91e63', textColor: 'white' },
  // Purple
  { key: '#9c27b0', textColor: 'white' },
  // Deep Purple
  { key: '#673ab7', textColor: 'white' },
  // Indigo
  { key: '#3f51b5', textColor: 'white' },
  // Blue
  { key: '#2196f3', textColor: 'white' },
  // Light Blue
  { key: '#03a9f4', textColor: 'primary' },
  // Cyan
  { key: '#00bcd4', textColor: 'primary' },
  // Teal
  { key: '#009688', textColor: 'white' },
  // Green
  { key: '#4caf50', textColor: 'primary' },
  // Light Green
  { key: '#8bc34a', textColor: 'primary' },
  // Lime
  { key: '#cddc39', textColor: 'primary' },
  // Yellow
  { key: '#ffeb3b', textColor: 'primary' },
  // Amber
  { key: '#ffc107', textColor: 'primary' },
  // Orange
  { key: '#ff9800', textColor: 'primary' },
  // Deep Orange
  { key: '#ff5722', textColor: 'white' },
  // Brown
  { key: '#795548', textColor: 'white' },
  // Grey
  { key: '#9e9e9e', textColor: 'primary' },
  // Blue Grey
  { key: '#607d8b', textColor: 'white' },
];

export const makeUserTheme = (palette: PaletteObject | null) => {
  if (palette) {
    return responsiveFontSizes(
      createMuiTheme({
        ...themeObj,
        palette: {
          ...themeObj.palette,
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
        ...themeObj,
        palette: {
          ...themeObj.palette,
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
  const opacitiesDark = {
    primary: 0.87,
    secondary: 0.54,
    disabled: 0.38,
    hint: 0.38,
  };
  const opacitiesLight = {
    primary: 1,
    secondary: 0.66,
    disabled: 0.5,
    hint: 0.5,
  };
  switch (palette.textColor) {
    case 'primary':
      const primaryText: TypeText = {
        primary: `rgba(0, 0, 0, ${opacitiesDark.primary})`,
        secondary: `rgba(0, 0, 0, ${opacitiesDark.secondary})`,
        disabled: `rgba(0, 0, 0, ${opacitiesDark.disabled})`,
        hint: `rgba(0, 0, 0, ${opacitiesDark.hint})`,
      };
      return primaryText;
    case 'white':
      const whiteText: TypeText = {
        primary: `rgba(255, 255, 255, ${opacitiesLight.primary})`,
        secondary: `rgba(255, 255, 255, ${opacitiesLight.secondary})`,
        disabled: `rgba(255, 255, 255, ${opacitiesLight.disabled})`,
        hint: `rgba(255, 255, 255, ${opacitiesLight.hint})`,
      };
      return whiteText;
    default:
      return theme.palette.text;
  }
};

export const linkColor: string = '#0365D6';

export default theme;
