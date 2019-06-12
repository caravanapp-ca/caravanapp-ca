import btoa from 'btoa';

const DiscordRedirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT);
const DiscordPermissions = ['identify', 'guilds.join', 'gdm.join'].join('%20');

const DiscordClientId = process.env.DISCORD_CLIENT_ID;
const DiscordClientSecret = process.env.DISCORD_CLIENT_SECRET;
const DiscordOAuth2Url = `https://discordapp.com/api/oauth2/authorize?client_id=${DiscordClientId}&redirect_uri=${DiscordRedirectUri}&response_type=code&scope=${DiscordPermissions}`;
const DiscordBase64Credentials = btoa(
  `${DiscordClientId}:${DiscordClientSecret}`
);
const GetDiscordTokenCallbackUri = (code: string) =>
  `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${DiscordRedirectUri}`;

export {
  DiscordBase64Credentials,
  DiscordClientId,
  DiscordClientSecret,
  DiscordOAuth2Url,
  GetDiscordTokenCallbackUri,
};
