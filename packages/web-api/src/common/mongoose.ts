import mongoose from 'mongoose';

export function checkObjectIdIsValid(id: string) {
  return (
    mongoose.Types.ObjectId.isValid(id) &&
    new mongoose.Types.ObjectId(id).toHexString() === id
  );
}
