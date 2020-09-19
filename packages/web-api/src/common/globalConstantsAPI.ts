import type {
  ClubRecommendationKey,
  EmailSettings,
  ReadingState,
  UnlimitedClubMembersValue,
} from '@caravanapp/types';

// This function returns the channel ID for #general-chat
// TODO: This breaks if we have multiple Discord servers.
export const DISCORD_GEN_CHAT_ID = () => {
  if (process.env.NODE_ENV === 'production') {
    // We're in prod
    return '592761082523680806';
  } else {
    // We're in test
    return '589194387968491532';
  }
};

export const VALID_READING_STATES: ReadingState[] = [
  'current',
  'notStarted',
  'read',
];

export const MAX_SHELF_SIZE = 10000;

// Determines what Discord permissions we request from the user on auth.
export const DISCORD_PERMISSIONS = [
  'email',
  'identify',
  'guilds.join',
  'gdm.join',
];

/**
 * Determines what we default email settings to.
 * If you're making a change here you will also need to change the default
 * on the model as I couldn't find a way to make those align.
 */

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  recs: true,
  reminders: true,
  updates: true,
};

// If changing here, please change in globalConstants in the Web project as well.
// Also, consider existing clubs in db which may have this value saved.
export const UNLIMITED_CLUB_MEMBERS_VALUE: UnlimitedClubMembersValue = -1;

// This should come from config instead of here
export const PROD_UNCOUNTABLE_IDS = [
  '491769129318088714', // Statbot
  '592761757764812801', // caravan-admin
  '592781980026798120', // caravan-clubs-bot
];

// In order of priority
export const CLUB_RECOMMENDATION_KEYS: ClubRecommendationKey[] = [
  'currReadTBR',
  'tBRMatch',
  'genreMatch',
  'new',
];

export const MAX_CLUB_AGE_RECOMMENDATION_DAYS = 14;
