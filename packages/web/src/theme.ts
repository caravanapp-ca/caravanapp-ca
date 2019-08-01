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

export const paletteColours: PaletteObject[] = [
  // COLOUR BACKGROUNDS
  // White
  { set: 'colour', key: '#FFFFFF', textColor: 'primary' },
  // Caravan Blurple
  { set: 'colour', key: '#5c6bc0', textColor: 'white' },
  // Red
  { set: 'colour', key: '#f44336', textColor: 'white' },
  // Pink
  { set: 'colour', key: '#e91e63', textColor: 'white' },
  // Purple
  { set: 'colour', key: '#9c27b0', textColor: 'white' },
  // Deep Purple
  { set: 'colour', key: '#673ab7', textColor: 'white' },
  // Indigo
  { set: 'colour', key: '#3f51b5', textColor: 'white' },
  // Blue
  { set: 'colour', key: '#2196f3', textColor: 'white' },
  // Light Blue
  { set: 'colour', key: '#03a9f4', textColor: 'primary' },
  // Cyan
  { set: 'colour', key: '#00bcd4', textColor: 'primary' },
  // Teal
  { set: 'colour', key: '#009688', textColor: 'white' },
  // Green
  { set: 'colour', key: '#4caf50', textColor: 'primary' },
  // Light Green
  { set: 'colour', key: '#8bc34a', textColor: 'primary' },
  // Lime
  { set: 'colour', key: '#cddc39', textColor: 'primary' },
  // Yellow
  { set: 'colour', key: '#ffeb3b', textColor: 'primary' },
  // Amber
  { set: 'colour', key: '#ffc107', textColor: 'primary' },
  // Orange
  { set: 'colour', key: '#ff9800', textColor: 'primary' },
  // Deep Orange
  { set: 'colour', key: '#ff5722', textColor: 'white' },
  // Brown
  { set: 'colour', key: '#795548', textColor: 'white' },
  // Grey
  { set: 'colour', key: '#9e9e9e', textColor: 'primary' },
  // Blue Grey
  { set: 'colour', key: '#607d8b', textColor: 'white' },
  // IMAGE BACKGROUNDS
  // Nature - Glaciers
  { set: 'nature', key: '#039BE5', textColor: 'primary', bgImage: 'nat-gla' },
  // Nature - Sunset
  { set: 'nature', key: '#183E68', textColor: 'white', bgImage: 'nat-sun' },
  // Nature - Desert
  { set: 'nature', key: '#FFCA28', textColor: 'primary', bgImage: 'nat-des' },
  // Nature - Volcano
  { set: 'nature', key: '#283593', textColor: 'white', bgImage: 'nat-vol' },
  // Nature - Waterfall
  { set: 'nature', key: '#43A047', textColor: 'primary', bgImage: 'nat-wat' },
  // Nature - All of Us
  { set: 'nature', key: '#3C3E67', textColor: 'white', bgImage: 'nat-all' },
  // Nature - Planet Earth
  { set: 'nature', key: '#3C3E67', textColor: 'white', bgImage: 'nat-pla' },
  // Nature - OUTTA
  { set: 'nature', key: '#3C3E67', textColor: 'white', bgImage: 'nat-out' },
  // QUOTE BACKGROUNDS
  // Quote - Read Love Repeat
  { set: 'quote', key: '#4DB6AC', textColor: 'white', bgImage: 'quo-rea' },
  // Quote - Lose & Find
  { set: 'quote', key: '#F1D4C3', textColor: 'primary', bgImage: 'quo-los' },
  // Quote - Hot Coffee
  { set: 'quote', key: '#7C98A2', textColor: 'white', bgImage: 'quo-hot' },
  // Quote - Treasure
  { set: 'quote', key: '#705838', textColor: 'white', bgImage: 'quo-tre' },
  // Quote - Perspective
  { set: 'quote', key: '#EDE0D6', textColor: 'primary', bgImage: 'quo-per' },
  // Quote - TOG
  { set: 'quote', key: '#B14AFF', textColor: 'white', bgImage: 'quo-tog' },
  // Quote - Maybe
  { set: 'quote', key: '#F1D3DF', textColor: 'primary', bgImage: 'quo-may' },
  // Quote - Somewhere
  { set: 'quote', key: '#F2EECD', textColor: 'primary', bgImage: 'quo-som' },
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

// paletteColours[1] is the location of Caravan Blurple
export const darkTheme = makeUserDarkTheme(paletteColours[1]) as Theme;

export const linkColor: string = '#0365D6';

export default theme;
