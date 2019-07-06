export const KEY_DISCORD_OAUTH_STATE = 'discordOAuthState';
export const KEY_HIDE_WELCOME_CLUBS = 'hideClubsWelcome';
export const KEY_USER = 'user';

export const clearStorageAuthState = () => {
  window.localStorage.removeItem(KEY_DISCORD_OAUTH_STATE);
  window.localStorage.removeItem(KEY_HIDE_WELCOME_CLUBS);
};
