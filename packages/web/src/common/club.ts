import { Types } from 'mongoose';

export const getClubIdFromPathname = (url: string): string => {
  const urlSplit = url.split('/');
  if (urlSplit.length !== 3 || !Types.ObjectId.isValid(urlSplit[2])) {
    throw new Error(`URL: ${url}, is not a valid club URL`);
  }
  return urlSplit[2];
};
