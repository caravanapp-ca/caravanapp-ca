// This function returns the channel ID for #general-chat
// TODO: This breaks if we have multiple Discord servers.
export const discordGenChatChId = () => {
  if (process.env.NODE_ENV === 'production') {
    // We're in prod
    return '592761082523680806';
  } else {
    // We're in test
    return '589194387968491532';
  }
};

// Determines what Discord permissions we request from the user on auth.
export const DiscordPermissions = [
  'email',
  'identify',
  'guilds.join',
  'gdm.join',
];
