import {
  PaletteSet,
  SameKeysAs,
  EmailSettings,
} from '@caravan/buddy-reading-types';

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

export const DISCORD_GUILD_LINK = () => {
  if (process.env.NODE_ENV === 'production') {
    // We're in prod
    return 'https://discord.gg/SmsYdBR';
  } else {
    // We're in test
    return 'https://discord.gg/EhnJHz3';
  }
};
