import axios from 'axios';
import btoa from 'btoa';
import Discord, { TextChannel } from 'discord.js';

import { UserDoc } from '@caravanapp/mongo';
import { ReferralTier } from '@caravanapp/types';

import {
  DISCORD_GEN_CHAT_ID,
  DISCORD_PERMISSIONS,
} from '../common/globalConstantsAPI';
import { getReferralTier } from './referral';
import { getUser } from './user';

const DiscordRedirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT);
const DiscordPermissionsParam = DISCORD_PERMISSIONS.join('%20');
const DiscordPermissionsSpaceDelimited = DISCORD_PERMISSIONS.join(' ');

const DiscordApiUrl = 'https://discordapp.com/api';
const DiscordBotSecret = process.env.DISCORD_BOT_SECRET;
const DiscordClientId = process.env.DISCORD_CLIENT_ID;
const DiscordClientSecret = process.env.DISCORD_CLIENT_SECRET;
const DiscordBase64Credentials = btoa(
  `${DiscordClientId}:${DiscordClientSecret}`
);

const getDiscordRedirectUri = (host: string) => {
  if (process.env.GAE_ENV === 'production') {
    // For max security, do no accept header as part of redirect url in production
    return DiscordRedirectUri;
  }
  // In staging environments and local environments, meh.
  const prefix = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  return encodeURIComponent(`${prefix}://${host}/api/auth/discord/callback`);
};

const DiscordOAuth2Url = (state: string, host: string) => {
  const redirectUri = getDiscordRedirectUri(host);
  return `${DiscordApiUrl}/oauth2/authorize?client_id=${DiscordClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${DiscordPermissionsParam}&state=${state}`;
};
const GetDiscordTokenCallbackUri = () => `${DiscordApiUrl}/v6/oauth2/token`;

const GetDiscordTokenRefreshCallbackUri = () =>
  `${DiscordApiUrl}/v6/oauth2/token`;

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

// Singleton pattern
const ReadingDiscordBot = (() => {
  let instance: Discord.Client;

  function createInstance() {
    const discordClient = new Discord.Client();
    discordClient.login(DiscordBotSecret);
    discordClient.on('ready', () => {
      discordClient.guilds.cache.forEach(guild => {
        guild.members.fetch();
      });
    });
    return discordClient;
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },

    getMe: async (accessToken: string) => {
      const userResponse = await axios.get(`${DiscordApiUrl}/users/@me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return userResponse.data as DiscordUserResponseData;
    },

    getToken: async (code: string, host: string) => {
      const tokenUri = GetDiscordTokenCallbackUri();
      const redirectUri = getDiscordRedirectUri(host) || DiscordRedirectUri;
      const body = {
        // eslint-disable-next-line @typescript-eslint/camelcase
        client_id: DiscordClientId,
        // eslint-disable-next-line @typescript-eslint/camelcase
        client_secret: DiscordClientSecret,
        // eslint-disable-next-line @typescript-eslint/camelcase
        grant_type: 'authorization_code',
        code,
        // eslint-disable-next-line @typescript-eslint/camelcase
        redirect_uri: redirectUri,
        scope: DiscordPermissionsSpaceDelimited,
      };
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      const tokenResponse = await axios.post<OAuth2TokenResponseData>(
        tokenUri,
        body,
        config
      );
      return tokenResponse;
    },

    refreshAccessToken: async (refreshToken: string) => {
      const refreshTokenUri = GetDiscordTokenRefreshCallbackUri();
      // ?client_id=${DiscordClientId}&client_secret=${DiscordClientSecret}&grant_type=refresh_token&refresh_token=${refreshToken}&redirect_uri=${DiscordRedirectUri}&scope=${DiscordPermissionsParam}
      const body = {
        // eslint-disable-next-line @typescript-eslint/camelcase
        client_id: DiscordClientId,
        // eslint-disable-next-line @typescript-eslint/camelcase
        client_secret: DiscordClientSecret,
        // eslint-disable-next-line @typescript-eslint/camelcase
        grant_type: 'refresh_token',
        refreshToken,
        // eslint-disable-next-line @typescript-eslint/camelcase
        redirect_uri: DiscordRedirectUri,
        scope: DiscordPermissionsSpaceDelimited,
      };
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      const tokenResponse = await axios.post<OAuth2TokenResponseData>(
        refreshTokenUri,
        body,
        config
      );
      return tokenResponse;
    },
  };
})();

export const giveDiscordRole = async (userId: string, role: string) => {
  const userDoc = await getUser(userId);
  if (!userDoc) {
    console.error(
      `Attempted to give user ${userId} a Discord role, but could not find them in db.`
    );
    return;
  }
  const client = ReadingDiscordBot.getInstance();
  const guild = client.guilds.cache.first();
  const guildMember = guild.members.cache.get(userDoc.discordId);
  if (!guildMember) {
    console.error(`Did not find user ${userId} in the Discord guild`);
    return;
  }
  console.log(`Giving user ${userId} Discord role ${role}`);
  return guildMember.roles.add(role);
};

export const sendNewTierDiscordMsg = async (
  user: string | UserDoc,
  newTier: number | ReferralTier
) => {
  let userObj = user;
  if (typeof userObj === 'string') {
    userObj = await getUser(userObj);
    if (!userObj) {
      throw new Error(`Did not find user ${user} in db.`);
    }
  }
  let referralTier = newTier;
  if (typeof referralTier === 'number') {
    referralTier = await getReferralTier(referralTier);
    if (!referralTier) {
      throw new Error(`Did not find referral tier ${newTier} in db.`);
    }
  }
  const client = ReadingDiscordBot.getInstance();
  const guild = client.guilds.cache.first();
  const genChatId = DISCORD_GEN_CHAT_ID();
  const genChannel = guild.channels.cache.get(genChatId) as TextChannel;
  if (!genChannel) {
    console.log('Did not find #general-chat at channel id ${genChatId}');
    throw new Error(`Did not find #general-chat at channel id ${genChatId}`);
  }
  const msgToSend = `<@${userObj.discordId}> just reached referral tier ${referralTier.tierNumber} (${referralTier.referralCount} referrals). Congratulations! :tada:`;
  console.log('Sending Discord message to #general-chat', msgToSend);
  return genChannel.send(msgToSend);
};

// class ReadingDiscordClient {
//   private readonly accessToken: string;
//   constructor(accessToken: string) {
//     this.accessToken = accessToken;
//   }

//   async getUser() {
//     const userResponse = await axios.get(`${DiscordApiUrl}/users/@me`, {
//       headers: { Authorization: `Bearer ${this.accessToken}` },
//     });
//     return userResponse.data as DiscordUserResponseData;
//   }

//   async getPrimaryGuildChannels() {
//     try {
//       const channelsResponse = await axios.get(
//         `${DiscordApiUrl}/guilds/${PrimaryGuild}/channels`,
//         {
//           headers: { Authorization: `Bot ${DiscordBotSecret}` },
//         }
//       );
//       return channelsResponse;
//     } catch (err) {
//       console.error(err);
//       throw err;
//     }
//   }

//   async joinPrimaryGuild(user: UserDoc) {
//     try {
//       const joinResponse = await axios.put(
//         `${DiscordApiUrl}/guilds/${PrimaryGuild}/members/${user.discordId}`,
//         {
//           headers: { Authorization: `Bot ${DiscordBotSecret}` },
//           access_token: this.accessToken,
//           // nick: user.discord.username,
//           // roles: [],
//           // mute: false,
//           // deaf: false,
//         }
//       );
//       return joinResponse.data as any;
//     } catch (err) {
//       console.error(err);
//       throw err;
//     }
//   }
// }

export {
  DiscordApiUrl,
  DiscordBase64Credentials,
  ReadingDiscordBot,
  DiscordClientId,
  DiscordClientSecret,
  DiscordOAuth2Url,
  DiscordUserResponseData,
  GetDiscordTokenCallbackUri,
  GetDiscordTokenRefreshCallbackUri,
  OAuth2TokenResponseData,
};
