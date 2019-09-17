export const getClubIdFromPathname = (url: string): string => {
  const urlSplit = url.split('/');
  if (urlSplit.length !== 3 || urlSplit[2].length !== 24) {
    throw new Error(`URL: ${url}, is not a valid club URL`);
  }
  return urlSplit[2];
};
