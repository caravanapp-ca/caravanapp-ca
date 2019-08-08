import { ReadingState } from "@caravan/buddy-reading-types";

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

export const VALID_READING_STATES: ReadingState[] = ['current', 'notStarted', 'read'];
export const MAX_SHELF_SIZE = 10000;
// Determines what Discord permissions we request from the user on auth.
export const DISCORD_PERMISSIONS = [
  'email',
  'identify',
  'guilds.join',
  'gdm.join',
];
