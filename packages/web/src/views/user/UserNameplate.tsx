import React from 'react';
import clsx from 'clsx';
import copyToClipboard from 'copy-to-clipboard';
import {
  Button,
  createStyles,
  Link,
  makeStyles,
  TextField,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { User, PaletteObject } from '@caravan/buddy-reading-types';
import { ReactComponent as DiscordLogo } from '../../resources/discord-logo.svg';
import { ReactComponent as DiscordLogoDark } from '../../resources/discord-logo-dark.svg';
import { ReactComponent as DiscordLogoWhite } from '../../resources/discord-logo-white.svg';
import UserBadgeIcon from '../../components/UserBadgeIcon';
import { getReferralLink } from '../../common/referral';
import { getBadgeToDisplay } from '../../common/getBadgeToDisplay';
import PaletteButton from '../../components/PaletteButton';
import { DISCORD_GUILD_LINK } from '../../common/globalConstants';

interface UserNameplateProps {
  user: User;
  referralCount: number | null;
  userIsMe: boolean;
  isEditing: boolean;
  onEdit: (
    field: 'name' | 'bio' | 'website' | 'palette',
    newValue: string | PaletteObject
  ) => void;
  valid: [boolean, string][];
  userDarkTheme?: Theme;
  onCopyReferralLink: () => void;
  selectablePalettes?: PaletteObject[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    leftIcon: {
      marginRight: theme.spacing(1),
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
    nameplateShade: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: 8,
      borderRadius: 4,
    },
    containerImgWhiteText: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    containerImgPrimaryText: {
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
  })
);

const guildLink = DISCORD_GUILD_LINK();

export default function UserNameplate(props: UserNameplateProps) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    user,
    referralCount,
    userIsMe,
    isEditing,
    onEdit,
    valid,
    userDarkTheme,
    onCopyReferralLink,
    selectablePalettes,
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

  const referralStatus =
    referralCount != null ? `${referralCount} referrals` : ' ';

  const badgeToDisplay = getBadgeToDisplay(user.badges);

  const nameplateShadeClass = clsx(classes.nameplateShade, {
    [classes.containerImgWhiteText]:
      user.palette &&
      user.palette.bgImage != null &&
      user.palette.textColor === 'white',
    [classes.containerImgPrimaryText]:
      user.palette &&
      user.palette.bgImage != null &&
      user.palette.textColor === 'primary',
  });

  if (userIsMe && isEditing && onEdit) {
    return (
      <MuiThemeProvider theme={userDarkTheme}>
        <div className={nameplateShadeClass}>
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
          {selectablePalettes && selectablePalettes.length > 0 && (
            <>
              <Typography color="textSecondary">Palette</Typography>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {selectablePalettes.map(paletteObj => (
                  <PaletteButton
                    palette={paletteObj}
                    onClick={palette => onEdit('palette', palette)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </MuiThemeProvider>
    );
  } else {
    return (
      <MuiThemeProvider theme={userDarkTheme}>
        <div className={nameplateShadeClass}>
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
            style={{ marginTop: badgeToDisplay ? 0 : theme.spacing(1) }}
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
          {referralStatus && (
            <Typography
              variant="body2"
              style={{ fontWeight: 600 }}
              color="textPrimary"
            >
              {referralStatus}
            </Typography>
          )}
          {user && !userIsMe && (
            <Button
              variant="outlined"
              color="primary"
              href={guildLink}
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
              color="primary"
              onClick={() =>
                copyToClipboard(getReferralLink(user._id, 'profile')) &&
                onCopyReferralLink()
              }
              style={{ marginTop: theme.spacing(1) }}
            >
              <Typography variant="button">Copy Referral Link</Typography>
            </Button>
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}
