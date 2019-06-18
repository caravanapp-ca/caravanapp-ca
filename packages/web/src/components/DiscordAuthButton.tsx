import btoa from 'btoa';
import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import { DISCORD_OAUTH_STATE } from '../state';

export interface DiscordAuthButtonProps {}

const useStyles = makeStyles(theme => ({
  button: {
    'background-color': '#7289da',
    color: 'white',
    margin: theme.spacing(1),
  },
  leftIcon: {
    color: 'white',
    marginRight: theme.spacing(1),
  },
}));

/**
 * @see https://auth0.com/docs/protocols/oauth2/oauth-state
 * @see https://auth0.com/docs/protocols/oauth2/mitigate-csrf-attacks
 * @see https://stackoverflow.com/a/52420482/4400318
 */
function getOAuth2StateParam() {
  const discordOAuthState = localStorage.getItem(DISCORD_OAUTH_STATE);
  if (discordOAuthState) {
    return discordOAuthState;
  }
  const typedArray = new Uint8Array(8);
  // (window as any).msCrypto for IE 11 support
  (window.crypto || (window as any).msCrypto).getRandomValues(typedArray);
  const arr = Array.from // if available
    ? Array.from(typedArray) // use Array#from
    : typedArray.map(v => v); // otherwise map()
  // Base64 encode the JSON so that it can be sent to an OAuth server
  const oauthState = btoa(JSON.stringify(arr));
  localStorage.setItem(DISCORD_OAUTH_STATE, oauthState);

  // and to retrieve it...
  // const str = localStorage.getItem('foo');
  // const retrievedArr = JSON.parse(oauthState);
  // const retrievedTypedArray = new Uint8Array(retrievedArr);
  // console.log(retrievedTypedArray.byteLength);

  return oauthState;
}

export default function DiscordAuthButton(props: DiscordAuthButtonProps) {
  const classes = useStyles();
  function onClick() {
    const oauth2State = getOAuth2StateParam();
    const host =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'
        : undefined;
    window.location.href = `${host}/api/auth/discord/login?state=${oauth2State}`;
  }
  return (
    <Button variant="contained" className={classes.button} onClick={onClick}>
      <LockIcon className={classes.leftIcon} />
      Login with Discord
    </Button>
  );
}
