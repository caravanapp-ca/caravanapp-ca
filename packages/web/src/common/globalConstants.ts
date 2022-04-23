import {
  PaletteSet,
  SameKeysAs,
  EmailSettings,
  UnlimitedClubMembersValue,
  ClubBotSettings,
} from '@caravanapp/types';
import { isMobileDevice } from './isMobileDevice';

// Store global constants for the Web project here.

const CLUB_SIZE_MIN = 2;

export const CLUB_SIZE_MAX = 50;

export const CLUB_SIZE_NO_LIMIT_LABEL = 'None';

export const CLUB_SIZES = [CLUB_SIZE_NO_LIMIT_LABEL];

for (let i = CLUB_SIZE_MIN; i <= CLUB_SIZE_MAX; i++) {
  CLUB_SIZES.push(i.toString());
}

// If changing here, please change in globalConstantsAPI in the Web API project as well.
// Also, consider existing clubs in db which may have this value saved.
export const UNLIMITED_CLUB_MEMBERS_VALUE: UnlimitedClubMembersValue = -1;

export const DEFAULT_MEMBER_LIMIT = 24;

export const REFERRAL_BADGE_KEYS = ['ref5', 'ref4', 'ref3', 'ref2', 'ref1'];

export const GLOBAL_PALETTE_SETS: PaletteSet[] = ['colour'];

export const MAX_EMAIL_LENGTH = 254;

export const EMAIL_SETTINGS_KEYS_DESCRIPTIONS: SameKeysAs<EmailSettings> = {
  reminders: 'Remind me of upcoming discussions for my clubs',
  recs: 'Recommend new clubs and users to read with',
  updates: 'Keep me posted on Caravan updates',
};

export const CUSTOM_DISCUSSION_FREQ_VALUE = -1;

export const DAYS_IN_WEEK = 7;

export const DEFAULT_SCHEDULE_DURATION_WEEKS = 3;
export const DEFAULT_SCHEDULE_DURATION_DAYS =
  DEFAULT_SCHEDULE_DURATION_WEEKS * DAYS_IN_WEEK;

export const MIN_SCHEDULE_DURATION_WEEKS = 1;
export const MIN_SCHEDULE_DURATION_DAYS =
  MIN_SCHEDULE_DURATION_WEEKS * DAYS_IN_WEEK;

export const MAX_SCHEDULE_DURATION_WEEKS = 6;
export const MAX_SCHEDULE_DURATION_DAYS =
  MAX_SCHEDULE_DURATION_WEEKS * DAYS_IN_WEEK;

export const DEFAULT_DISCUSSION_FREQ_DAYS: number | null = null;
export const MIN_DISCUSSION_FREQ_DAYS = 0;
export const MAX_DISCUSSION_FREQ_DAYS = 7;

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  recs: true,
  reminders: true,
  updates: true,
};

export const DISCORD_GUILD_LINK =
  process.env.NODE_ENV === 'production'
    ? isMobileDevice()
      ? 'https://discord.gg/dAXDb9E'
      : 'https://discord.com/channels/592761082523680798/592761082523680806'
    : isMobileDevice()
    ? 'https://discord.gg/EhnJHz3'
    : 'https://discord.com/channels/589194387968491530/589194387968491532';

export const CARAVAN_BOT_NAME = 'caravan-clubs-bot';

export const CLUB_BOT_SETTINGS_KEYS_DESCRIPTIONS: SameKeysAs<ClubBotSettings> =
  {
    intros: 'Introduce new members in chat when they join the club',
  };

export const DEFAULT_CLUB_BOT_SETTINGS: ClubBotSettings = {
  intros: true,
};
