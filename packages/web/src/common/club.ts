import { isValidObjectId } from './validObjectId';

export const getClubIdFromPathname = (url: string): string => {
  const urlSplit = url.split('/');
  if (urlSplit.length !== 3 || !isValidObjectId(urlSplit[2])) {
    throw new Error(`URL: ${url}, is not a valid club URL`);
  }
  return urlSplit[2];
};
