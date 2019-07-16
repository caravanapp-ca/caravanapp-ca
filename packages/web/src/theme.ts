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

export const getUserTextPalette = (palette?: PaletteObject) => {
  const opacities = {
    primary: 0.87,
    secondary: 0.54,
    disabled: 0.38,
    hint: 0.38,
  };
  if (palette) {
    switch (palette.textColor) {
      case 'primary':
        return {
          primary: `rgba(0, 0, 0, ${opacities.primary})`,
          secondary: `rgba(0, 0, 0, ${opacities.secondary})`,
          disabled: `rgba(0, 0, 0, ${opacities.disabled})`,
          hint: `rgba(0, 0, 0, ${opacities.hint})`,
        };
      case 'white':
        return {
          primary: `rgba(255, 255, 255, ${opacities.primary})`,
          secondary: `rgba(255, 255, 255, ${opacities.secondary})`,
          disabled: `rgba(255, 255, 255, ${opacities.disabled})`,
          hint: `rgba(255, 255, 255, ${opacities.hint})`,
        };
    }
  }
  return theme.palette.text;
};

export const linkColor: string = '#0365D6';

export default theme;
