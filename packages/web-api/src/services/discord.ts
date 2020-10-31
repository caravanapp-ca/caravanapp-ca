import btoa from 'btoa';
import Discord, { TextChannel } from 'discord.js';
import FormData from 'form-data';
import fetch from 'node-fetch';

import type { UserDoc } from '@caravanapp/mongo';
import type { ReferralTier } from '@caravanapp/types';

import {
  DISCORD_GEN_CHAT_ID,
  DISCORD_PERMISSIONS,
} from '../common/globalConstantsAPI';
import { getReferralTier } from './referral';
import { getUser } from './user';

const DiscordRedirectUri = process.env.DISCORD_REDIRECT;
const DiscordPermissionsParam = DISCORD_PERMISSIONS.join('%20');
const DiscordPermissionsSpaceDelimited = DISCORD_PERMISSIONS.join(' ');

const DiscordApiUrl = 'https://discord.com/api';
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
  return `${prefix}://${host}/api/auth/discord/callback`;
};

const DiscordOAuth2Url = (state: string, host: string) => {
  const redirectUri = getDiscordRedirectUri(host);
  return `${DiscordApiUrl}/oauth2/authorize?client_id=${DiscordClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${DiscordPermissionsParam}&state=${state}`;
};
const DISCORD_TOKEN_URI = `${DiscordApiUrl}/oauth2/token`;

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
      const data = await fetch(`${DiscordApiUrl}/users/@me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(res => res.json() as Promise<DiscordUserResponseData>);
      return data;
    },

    getToken: async (code: string, host: string) => {
      const redirectUri = getDiscordRedirectUri(host) || DiscordRedirectUri;
      const data = new FormData();
      data.append('client_id', DiscordClientId);
      data.append('client_secret', DiscordClientSecret);
      data.append('grant_type', 'authorization_code');
      data.append('redirect_uri', redirectUri);
      data.append('scope', DiscordPermissionsSpaceDelimited);
      data.append('code', code);
      const response = await fetch(DISCORD_TOKEN_URI, {
        method: 'POST',
        body: data,
      }).then(res => res.json() as Promise<OAuth2TokenResponseData>);
      return response;
    },

    refreshAccessToken: async (refreshToken: string) => {
      const data = new FormData();
      data.append('client_id', DiscordClientId);
      data.append('client_secret', DiscordClientSecret);
      data.append('grant_type', 'refresh_token');
      data.append('refresh_token', refreshToken);
      data.append('redirect_uri', DiscordRedirectUri);
      data.append('scope', DiscordPermissionsSpaceDelimited);
      const response = await fetch(DISCORD_TOKEN_URI, {
        method: 'POST',
        body: data,
      }).then(res => res.json() as Promise<OAuth2TokenResponseData>);
      return response;
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
  OAuth2TokenResponseData,
};
