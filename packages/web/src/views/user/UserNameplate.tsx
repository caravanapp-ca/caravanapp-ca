import React from 'react';
import { User, PaletteObject } from '@caravan/buddy-reading-types';
import {
  Typography,
  Button,
  Link,
  makeStyles,
  createStyles,
  useTheme,
  TextField,
  Fab,
  Theme,
  createMuiTheme,
} from '@material-ui/core';
import { ReactComponent as DiscordLogo } from '../../resources/discord-logo.svg';
import {
  responsiveFontSizes,
  MuiThemeProvider,
} from '@material-ui/core/styles';

interface UserNameplateProps {
  user: User;
  userIsMe: boolean;
  isEditing: boolean;
  onEdit: (
    field: 'name' | 'bio' | 'website' | 'palette',
    newValue: string | PaletteObject
  ) => void;
  valid: [boolean, string][];
  palette: PaletteObject | null;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    editContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    textField: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

export default function UserNameplate(props: UserNameplateProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { user, userIsMe, isEditing, onEdit, valid, palette } = props;
  const [focused, setFocused] = React.useState<{
    name: boolean;
    bio: boolean;
    website: boolean;
  }>({
    name: false,
    bio: false,
    website: false,
  });

  const lengths = {
    name: {
      min: 2,
      max: 30,
    },
    bio: {
      min: 0,
      max: 150,
    },
  };

  const msgBtnLabel: string = user.discordUsername
    ? `MESSAGE ${user.discordUsername}`
    : 'MESSAGE';
  const msgBtnLabelCaps = msgBtnLabel.toUpperCase();

  const paletteColours: PaletteObject[] = [
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

  const opacities = {
    primary: 0.87,
    secondary: 0.54,
    disabled: 0.38,
    hint: 0.38,
  };

  const getUserTextColors = () => {
    if (user && user.palette && user.palette.textColor) {
      switch (user.palette.textColor) {
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

  const userTextColors = getUserTextColors();

  const nameplateTheme = user
    ? responsiveFontSizes(
        createMuiTheme({
          ...theme,
          palette: {
            ...theme.palette,
            primary: {
              main:
                user && user.palette
                  ? userTextColors.primary
                  : theme.palette.primary.main,
            },
            text: userTextColors,
          },
        })
      )
    : theme;

  // TODO: Add userIsMe to if statement after testing
  if (isEditing && onEdit) {
    return (
      <MuiThemeProvider theme={nameplateTheme}>
        <div className={classes.editContainer}>
          <TextField
            id="display-name"
            label="Display Name"
            inputProps={{ maxLength: lengths.name.max }}
            onFocus={() => setFocused({ ...focused, name: true })}
            onBlur={() => setFocused({ ...focused, name: false })}
            error={!valid[0][0]}
            helperText={
              !valid[0][0]
                ? valid[0][1]
                : focused.name
                ? user && user.name
                  ? `${lengths.name.max - user.name.length} chars remaining`
                  : `Max ${lengths.name.max} chars`
                : ' '
            }
            className={classes.textField}
            value={user.name}
            onChange={e => onEdit('name', e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            id="bio"
            label="Bio"
            multiline
            rowsMax={2}
            inputProps={{ maxLength: lengths.bio.max }}
            onFocus={() => setFocused({ ...focused, bio: true })}
            onBlur={() => setFocused({ ...focused, bio: false })}
            error={!valid[1][0]}
            helperText={
              !valid[1][0]
                ? valid[1][1]
                : focused.bio
                ? user && user.bio
                  ? `${lengths.bio.max - user.bio.length} chars remaining`
                  : `Max ${lengths.bio.max} chars`
                : ' '
            }
            className={classes.textField}
            value={user.bio}
            onChange={e => onEdit('bio', e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            id="website"
            label="Website"
            onFocus={() => setFocused({ ...focused, website: true })}
            onBlur={() => setFocused({ ...focused, website: false })}
            error={!valid[2][0]}
            helperText={!valid[2][0] ? valid[2][1] : ' '}
            className={classes.textField}
            value={user.website}
            onChange={e => onEdit('website', e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <Typography color="textSecondary">Palette</Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {paletteColours.map(colourObj => (
              <Fab
                size="small"
                color="secondary"
                aria-label="Add"
                style={{
                  backgroundColor: colourObj.key,
                  marginRight: theme.spacing(1),
                  marginTop: theme.spacing(1),
                }}
                onClick={() => onEdit('palette', colourObj)}
              />
            ))}
          </div>
        </div>
      </MuiThemeProvider>
    );
  } else {
    return (
      <MuiThemeProvider theme={nameplateTheme}>
        <Typography variant="h4" color="textPrimary">
          {user.name}
        </Typography>
        <Typography
          variant="body1"
          color="textPrimary"
          style={{ marginTop: theme.spacing(1) }}
        >
          {user.bio}
        </Typography>
        <Typography variant="body1" color="textPrimary">
          <Link
            href={
              user.website
                ? user.website.startsWith('http')
                  ? user.website
                  : `https://${user.website}`
                : ''
            }
          >
            {user.website}
          </Link>
        </Typography>
        {user && !userIsMe && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() =>
              window.open(
                `https://discordapp.com/channels/592761082523680798/592810415193587724`,
                '_blank'
              )
            }
            style={{ marginTop: theme.spacing(1) }}
          >
            <DiscordLogo
              style={{
                marginRight: theme.spacing(1),
                height: 28,
                width: 28,
              }}
            />
            <Typography variant="button">{msgBtnLabelCaps}</Typography>
          </Button>
        )}
      </MuiThemeProvider>
    );
  }
}
