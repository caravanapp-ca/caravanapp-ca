import axios from 'axios';
import btoa from 'btoa';
import fetch from 'node-fetch';

const DiscordRedirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT);
const DiscordPermissions = ['identify', 'guilds.join', 'gdm.join'].join('%20');

const DiscordApiUrl = 'https://discordapp.com/api';
const DiscordClientId = process.env.DISCORD_CLIENT_ID;
const DiscordClientSecret = process.env.DISCORD_CLIENT_SECRET;
const DiscordBase64Credentials = btoa(
  `${DiscordClientId}:${DiscordClientSecret}`
);
const DiscordOAuth2Url = (state: string) =>
  `${DiscordApiUrl}/oauth2/authorize?client_id=${DiscordClientId}&redirect_uri=${DiscordRedirectUri}&response_type=code&scope=${DiscordPermissions}&state=${state}`;
const GetDiscordTokenCallbackUri = (code: string) =>
  `${DiscordApiUrl}/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${DiscordRedirectUri}`;
const GetDiscordTokenRefreshCallbackUri = (refreshToken: string) =>
  `${DiscordApiUrl}/oauth2/token?client_id=${DiscordClientId}&client_secret=${DiscordClientSecret}&grant_type=refresh_token&refresh_token=${refreshToken}&redirect_uri=${DiscordRedirectUri}&scope=${DiscordPermissions}`;

interface DiscordUserResponseData {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  bot?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
}

interface OAuth2TokenResponseData {
  access_token: string;
  /** Time until expiration (seconds) */
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: 'Bearer';

  error?: string;
  error_description?: string;
}

class DiscordClient {
  private readonly accessToken: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getUser() {
    const userResponse = await axios.get(`${DiscordApiUrl}/users/@me`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    return userResponse.data as DiscordUserResponseData;
  }

  static async getToken(code: string) {
    const tokenUri = GetDiscordTokenCallbackUri(code);
    // const tokenResponse = await axios.post(tokenUri, {
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     Authorization: `Basic ${DiscordBase64Credentials}`,
    //   },
    // });
    const tokenResponse = await fetch(tokenUri, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${DiscordBase64Credentials}`,
      },
    });
    return (await tokenResponse.json()) as OAuth2TokenResponseData;
  }

  static async refreshAccessToken(refreshToken: string) {
    const refreshTokenUri = GetDiscordTokenRefreshCallbackUri(refreshToken);
    // const tokenRefreshResponse = await axios.post(refreshTokenUri, {
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     Authorization: `Basic ${DiscordBase64Credentials}`,
    //   },
    // });
    // return tokenRefreshResponse.data as OAuth2TokenResponseData;
    const tokenResponse = await fetch(refreshTokenUri, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${DiscordBase64Credentials}`,
      },
    });
    return (await tokenResponse.json()) as OAuth2TokenResponseData;
  }
}

export {
  DiscordApiUrl,
  DiscordBase64Credentials,
  DiscordClient,
  DiscordClientId,
  DiscordClientSecret,
  DiscordOAuth2Url,
  DiscordUserResponseData,
  GetDiscordTokenCallbackUri,
  GetDiscordTokenRefreshCallbackUri,
  OAuth2TokenResponseData,
};
