import {
  PaletteSet,
  SameKeysAs,
  EmailSettings,
} from '@caravan/buddy-reading-types';
import { isMobileDevice } from './isMobileDevice';

// Store global constants for the Web project here.

export const DEFAULT_CLUB_SCHED_DURATION = 3;

export const DEFAULT_CLUB_SCHED_DISC_FREQ = null;

export const REFERRAL_BADGE_KEYS = ['ref5', 'ref4', 'ref3', 'ref2', 'ref1'];

export const GLOBAL_PALETTE_SETS: PaletteSet[] = ['colour'];

export const MAX_EMAIL_LENGTH = 254;

export const EMAIL_SETTINGS_KEYS_DESCRIPTIONS: SameKeysAs<EmailSettings> = {
  reminders: 'Remind me of upcoming discussions for my clubs',
  recs: 'Recommend new clubs and users to read with',
  updates: 'Keep me posted on Caravan updates',
};

export const MIN_SCHEDULE_LENGTH_DAYS = 7;

export const DISCORD_GUILD_LINK =
  process.env.NODE_ENV === 'production'
    ? isMobileDevice()
      ? 'https://discord.gg/dAXDb9E'
      : 'https://discordapp.com/channels/592761082523680798/592761082523680806'
    : isMobileDevice()
    ? 'https://discord.gg/EhnJHz3'
    : 'https://discordapp.com/channels/589194387968491530/589194387968491532';
