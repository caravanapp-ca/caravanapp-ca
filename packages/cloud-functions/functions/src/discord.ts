import btoa from 'btoa';
import { Client as DiscordClient, TextChannel } from 'discord.js';
import { UserDoc } from '@caravan/buddy-reading-mongo';
import { ReferralTier } from '@caravan/buddy-reading-types';
import { getUser } from './services/user';

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

export {
  DiscordApiUrl,
  DiscordBase64Credentials,
  ReadingDiscordBot,
  DiscordClientId,
  DiscordClientSecret,
  DiscordUserResponseData,
  OAuth2TokenResponseData,
};
