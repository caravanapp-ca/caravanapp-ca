import { Types } from 'mongoose';

export function checkObjectIdIsValid(id: string) {
  return (
    Types.ObjectId.isValid(id) && new Types.ObjectId(id).toHexString() === id
  );
}
