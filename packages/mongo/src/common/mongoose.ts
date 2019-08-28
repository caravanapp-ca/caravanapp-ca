import { Schema, SchemaTypeOpts, SchemaType, Types } from 'mongoose';
import { FilterAutoMongoKeys } from '@caravan/buddy-reading-types';

export function checkObjectIdIsValid(id: string) {
  return (
    Types.ObjectId.isValid(id) && new Types.ObjectId(id).toHexString() === id
  );
}

export type MongooseSchema<DocDefinition> = {
  [k in keyof Required<FilterAutoMongoKeys<DocDefinition>>]:
    | SchemaTypeOpts<any>
    | Schema
    | SchemaType;
};
