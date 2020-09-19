import type { PaletteObject } from '@caravanapp/types';
import { createMuiTheme, responsiveFontSizes, Theme } from '@material-ui/core';
import { TypeText } from '@material-ui/core/styles/createPalette';

const montserrat = require('typeface-montserrat');

const darkText: TypeText = {
  primary: 'rgba(0, 0, 0, 0.87)',
  secondary: 'rgba(0, 0, 0, 0.65)',
  disabled: 'rgba(0, 0, 0, 0.49)',
  hint: 'rgba(0, 0, 0, 0.49)',
};
const lightText: TypeText = {
  primary: 'rgba(255, 255, 255, 1)',
  secondary: 'rgba(255, 255, 255, 0.75)',
  disabled: 'rgba(255, 255, 255, 0.56)',
  hint: 'rgba(255, 255, 255, 0.56)',
};

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
      text: lightText,
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

export const whiteTheme = responsiveFontSizes(
  createMuiTheme({
    ...themeObj,
    palette: {
      ...themeObj.palette,
      primary: {
        main: '#FFFFFF',
      },
      secondary: {
        main: themeObj.palette.primary.main,
      },
    },
  })
);

export const shelfPostTheme = responsiveFontSizes(
  createMuiTheme({
    ...themeObj,
    palette: {
      ...themeObj.palette,
      primary: {
        main: '#64B5F6',
      },
      secondary: {
        main: themeObj.palette.primary.main,
      },
    },
  })
);

export const palettes: PaletteObject[] = [
  // COLOUR BACKGROUNDS
  // White
  { id: 'col-whi', set: 'colour', key: '#FFFFFF', textColor: 'primary' },
  // Caravan Blurple
  { id: 'col-cbl', set: 'colour', key: '#5c6bc0', textColor: 'white' },
  // Red
  { id: 'col-red', set: 'colour', key: '#f44336', textColor: 'white' },
  // Pink
  { id: 'col-pin', set: 'colour', key: '#e91e63', textColor: 'white' },
  // Purple
  { id: 'col-pur', set: 'colour', key: '#9c27b0', textColor: 'white' },
  // Deep Purple
  { id: 'col-dpu', set: 'colour', key: '#673ab7', textColor: 'white' },
  // Indigo
  { id: 'col-ind', set: 'colour', key: '#3f51b5', textColor: 'white' },
  // Blue
  { id: 'col-blu', set: 'colour', key: '#2196f3', textColor: 'white' },
  // Light Blue
  { id: 'col-lbl', set: 'colour', key: '#03a9f4', textColor: 'primary' },
  // Cyan
  { id: 'col-cya', set: 'colour', key: '#00bcd4', textColor: 'primary' },
  // Teal
  { id: 'col-tea', set: 'colour', key: '#009688', textColor: 'white' },
  // Green
  { id: 'col-gre', set: 'colour', key: '#4caf50', textColor: 'primary' },
  // Light Green
  { id: 'col-lgr', set: 'colour', key: '#8bc34a', textColor: 'primary' },
  // Lime
  { id: 'col-lim', set: 'colour', key: '#cddc39', textColor: 'primary' },
  // Yellow
  { id: 'col-yel', set: 'colour', key: '#ffeb3b', textColor: 'primary' },
  // Amber
  { id: 'col-amb', set: 'colour', key: '#ffc107', textColor: 'primary' },
  // Orange
  { id: 'col-ora', set: 'colour', key: '#ff9800', textColor: 'primary' },
  // Deep Orange
  { id: 'col-dor', set: 'colour', key: '#ff5722', textColor: 'white' },
  // Brown
  { id: 'col-bro', set: 'colour', key: '#795548', textColor: 'white' },
  // Grey
  { id: 'col-gre', set: 'colour', key: '#9e9e9e', textColor: 'primary' },
  // Blue Grey
  { id: 'col-bgr', set: 'colour', key: '#607d8b', textColor: 'white' },
  // IMAGE BACKGROUNDS
  // Nature - Glaciers
  {
    id: 'nat-gla',
    set: 'nature',
    key: '#039BE5',
    textColor: 'primary',
    bgImage:
      'https://storage.googleapis.com/buddy-reading-storage-pub/profile-backgrounds/nat-gla.svg',
    mobileAlignment: 'right',
  },
  // Nature - Sunset
  {
    id: 'nat-sun',
    set: 'nature',
    key: '#183E68',
    textColor: 'white',
    bgImage:
      'https://storage.googleapis.com/buddy-reading-storage-pub/profile-backgrounds/nat-sun.svg',
  },
  // Nature - Desert
  {
    id: 'nat-des',
    set: 'nature',
    key: '#FFCA28',
    textColor: 'primary',
    bgImage:
      'https://storage.googleapis.com/buddy-reading-storage-pub/profile-backgrounds/nat-des.svg',
  },
  // Nature - Volcano
  {
    id: 'nat-vol',
    set: 'nature',
    key: '#283593',
    textColor: 'white',
    bgImage:
      'https://storage.googleapis.com/buddy-reading-storage-pub/profile-backgrounds/nat-vol.svg',
  },
  // Nature - Waterfall
  {
    id: 'nat-wat',
    set: 'nature',
    key: '#43A047',
    textColor: 'primary',
    bgImage:
      'https://storage.googleapis.com/buddy-reading-storage-pub/profile-backgrounds/nat-wat.svg',
  },
  // Nature - All of Us
  {
    id: 'nat-all',
    set: 'nature',
    key: '#3C3E67',
    textColor: 'white',
    bgImage:
      'https://storage.googleapis.com/buddy-reading-storage-pub/profile-backgrounds/nat-all.svg',
    mobileAlignment: 'left',
  },
  // Nature - Planet Earth
  {
    id: 'nat-pla',
    set: 'nature',
    key: '#3C3E67',
    textColor: 'white',
    bgImage:
      'https://storage.googleapis.com/buddy-reading-storage-pub/profile-backgrounds/nat-pla.svg',
    mobileAlignment: 'left',
  },
  // Nature - OUTTA
  {
    id: 'nat-out',
    set: 'nature',
    key: '#3C3E67',
    textColor: 'white',
    bgImage:
      'https://storage.googleapis.com/buddy-reading-storage-pub/profile-backgrounds/nat-out.svg',
    mobileAlignment: 'left',
  },
  // QUOTE BACKGROUNDS
  // Quote - Read Love Repeat
  {
    id: 'quo-rea',
    set: 'quote',
    key: '#4DB6AC',
    textColor: 'white',
    bgImage:
      'https://storage.googleapis.com/buddy-reading-storage-pub/profile-backgrounds/quo-rea.svg',
    mobileAlignment: 'left',
  },
  // Quote - Lose & Find
  {
    id: 'quo-los',
    set: 'quote',
    key: '#F1D4C3',
    textColor: 'primary',
    bgImage:
      'https://storage.googleapis.com/buddy-reading-storage-pub/profile-backgrounds/quo-los.svg',
    mobileAlignment: 'left',
  },
  // Quote - Hot Coffee
  {
    id: 'quo-hot',
    set: 'quote',
    key: '#7C98A2',
    textColor: 'white',
    bgImage:
      'https://storage.googleapis.com/buddy-reading-storage-pub/profile-backgrounds/quo-hot.svg',
    mobileAlignment: 'left',
  },
  // Quote - Treasure
  {
    id: 'quo-tre',
    set: 'quote',
    key: '#705838',
    textColor: 'white',
    bgImage:
      'https://storage.googleapis.com/buddy-reading-storage-pub/profile-backgrounds/quo-tre.svg',
    mobileAlignment: 'left',
  },
  // Quote - Perspective
  {
    id: 'quo-per',
    set: 'quote',
    key: '#EDE0D6',
    textColor: 'primary',
    bgImage:
      'https://storage.googleapis.com/buddy-reading-storage-pub/profile-backgrounds/quo-per.svg',
    mobileAlignment: 'left',
  },
  // Quote - TOG
  {
    id: 'quo-tog',
    set: 'quote',
    key: '#B14AFF',
    textColor: 'white',
    bgImage:
      'https://storage.googleapis.com/buddy-reading-storage-pub/profile-backgrounds/quo-tog.svg',
    mobileAlignment: 'left',
  },
  // Quote - Maybe
  {
    id: 'quo-may',
    set: 'quote',
    key: '#F1D3DF',
    textColor: 'primary',
    bgImage:
      'https://storage.googleapis.com/buddy-reading-storage-pub/profile-backgrounds/quo-may.svg',
    mobileAlignment: 'left',
  },
  // Quote - Somewhere
  {
    id: 'quo-som',
    set: 'quote',
    key: '#F2EECD',
    textColor: 'primary',
    bgImage:
      'https://storage.googleapis.com/buddy-reading-storage-pub/profile-backgrounds/quo-som.svg',
    mobileAlignment: 'left',
  },
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
  switch (palette.textColor) {
    case 'primary':
      return darkText;
    case 'white':
      return lightText;
    default:
      return theme.palette.text;
  }
};

// paletteColours[1] is the location of Caravan Blurple
export const darkTheme = makeUserDarkTheme(palettes[1]) as Theme;

export const linkColor: string = '#0365D6';

export default theme;
