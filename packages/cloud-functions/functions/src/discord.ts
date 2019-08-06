import btoa from 'btoa';
import { Client as DiscordClient, TextChannel } from 'discord.js';
import { ReferralTier } from '@caravan/buddy-reading-types';

const DiscordApiUrl = 'https://discordapp.com/api';
const DiscordBotSecret = process.env.DISCORD_BOT_SECRET;
const DiscordClientId = process.env.DISCORD_CLIENT_ID;
const DiscordClientSecret = process.env.DISCORD_CLIENT_SECRET;
const DiscordBase64Credentials = btoa(
  `${DiscordClientId}:${DiscordClientSecret}`
);

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
  let instance: DiscordClient;

  function createInstance() {
    const discordClient = new DiscordClient();
    discordClient.login(DiscordBotSecret);
    return discordClient;
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

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
  const guild = client.guilds.first();
  const genChatId = discordGenChatChId();
  const genChannel = guild.channels.get(genChatId) as TextChannel;
  if (!genChannel) {
    console.log('Did not find #general-chat at channel id ${genChatId}');
    throw new Error(`Did not find #general-chat at channel id ${genChatId}`);
  }
  const msgToSend = `<@${userObj.discordId}> just reached referral tier ${
    referralTier.tierNumber
  } (${referralTier.referralCount} referrals). Congratulations! :tada:`;
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
  DiscordUserResponseData,
  OAuth2TokenResponseData,
};
