import mongoose from 'mongoose';
import { BookSource } from '@caravan/buddy-reading-types';

export function checkObjectIdIsValid(id: string) {
  return (
    mongoose.Types.ObjectId.isValid(id) &&
    new mongoose.Types.ObjectId(id).toHexString() === id
  );
}

export function createBookId(sourceId: string, sourceType?: BookSource) {
  switch (sourceType) {
    case 'google':
      return mongoose.Types.ObjectId(`${sourceId}`);
    case 'amazon':
      return mongoose.Types.ObjectId(`${sourceId}_amazon`);
    case 'wattpad':
      return mongoose.Types.ObjectId(`${sourceId}_wattpad`);
    case 'unknown':
      return mongoose.Types.ObjectId(`${sourceId}_unknown`);
    default:
      // Default to Google
      return mongoose.Types.ObjectId(`${sourceId}`);
  }
}
