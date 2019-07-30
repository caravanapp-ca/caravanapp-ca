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
} from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import copyToClipboard from 'copy-to-clipboard';
import { ReactComponent as DiscordLogo } from '../../resources/discord-logo.svg';
import { ReactComponent as DiscordLogoDark } from '../../resources/discord-logo-dark.svg';
import { ReactComponent as DiscordLogoWhite } from '../../resources/discord-logo-white.svg';
import { paletteColours } from '../../theme';
import UserBadgeIcon from '../../components/UserBadgeIcon';
import getReferralLink from '../../functions/getReferralLink';
import { getBadgeToDisplay } from '../../functions/getBadgeToDisplay';

interface UserNameplateProps {
  user: User;
  userIsMe: boolean;
  isEditing: boolean;
  onEdit: (
    field: 'name' | 'bio' | 'website' | 'palette',
    newValue: string | PaletteObject
  ) => void;
  valid: [boolean, string][];
  userDarkTheme?: Theme;
  onCopyReferralLink: () => void;
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
    nameAndBadge: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    referralLinkField: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

export default function UserNameplate(props: UserNameplateProps) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    user,
    userIsMe,
    isEditing,
    onEdit,
    valid,
    userDarkTheme,
    onCopyReferralLink,
  } = props;
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

  const badgeToDisplay = getBadgeToDisplay(user.badges);

  if (userIsMe && isEditing && onEdit) {
    return (
      <MuiThemeProvider theme={userDarkTheme}>
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
          <Button
            variant="outlined"
            onClick={() =>
              copyToClipboard(getReferralLink(user._id, 'home')) &&
              onCopyReferralLink()
            }
            style={{
              width: '20%',
              justifyContent: 'flex-start',
              marginBottom: theme.spacing(2),
              fontWeight: 600,
            }}
          >
            <Typography variant="button">Copy Referral Link</Typography>
          </Button>
          <Typography color="textSecondary">Palette</Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {paletteColours.map(colourObj => (
              <Fab
                size="small"
                aria-label="palette-colour"
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
      <MuiThemeProvider theme={userDarkTheme}>
        <div className={classes.nameAndBadge}>
          <Typography
            variant="h4"
            color="textPrimary"
            style={{ fontWeight: 600 }}
          >
            {user.name}
          </Typography>
          {badgeToDisplay && <UserBadgeIcon badge={badgeToDisplay} />}
        </div>
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
            href="https://discordapp.com/channels/592761082523680798/592810415193587724"
            target="_blank"
            style={{ marginTop: theme.spacing(1) }}
          >
            {!userDarkTheme && (
              <DiscordLogo
                style={{
                  marginRight: theme.spacing(1),
                  height: 28,
                  width: 28,
                }}
              />
            )}
            {userDarkTheme &&
              user.palette &&
              user.palette.textColor === 'primary' && (
                <DiscordLogoDark
                  style={{
                    marginRight: theme.spacing(1),
                    height: 28,
                    width: 28,
                  }}
                />
              )}
            {userDarkTheme &&
              user.palette &&
              user.palette.textColor === 'white' && (
                <DiscordLogoWhite
                  style={{
                    marginRight: theme.spacing(1),
                    height: 28,
                    width: 28,
                  }}
                />
              )}
            <Typography variant="button">{msgBtnLabelCaps}</Typography>
          </Button>
        )}
        {user && userIsMe && (
          <Button
            variant="outlined"
            onClick={() =>
              copyToClipboard(getReferralLink(user._id, 'home')) &&
              onCopyReferralLink()
            }
            style={{ marginTop: theme.spacing(1) }}
          >
            <Typography variant="button">Copy Referral Link</Typography>
          </Button>
        )}
      </MuiThemeProvider>
    );
  }
}
