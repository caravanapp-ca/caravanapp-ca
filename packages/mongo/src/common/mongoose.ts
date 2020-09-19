import { Schema, SchemaType, SchemaTypeOpts, Types } from 'mongoose';

import type { FilterAutoMongoKeys } from '@caravanapp/types';

export function checkObjectIdIsValid(id: string): boolean {
  return (
    Types.ObjectId.isValid(id) && new Types.ObjectId(id).toHexString() === id
  );
}

export type MongooseSchema<DocDefinition> = {
  [k in keyof Required<FilterAutoMongoKeys<DocDefinition>>]:  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | SchemaTypeOpts<any>
    | Schema
    | SchemaType;
};

export type FilterMongooseDocKeys<Base> = Omit<
  Base,
  | 'increment'
  | 'model'
  | '$isDeleted'
  | 'remove'
  | 'save'
  | '$isDefault'
  | '$session'
  | 'depopulate'
  | 'equals'
  | 'execPopulate'
  | 'isDirectSelected'
  | 'get'
  | 'init'
  | 'inspect'
  | 'invalidate'
  | 'isDirectModified'
  | 'isInit'
  | 'isModified'
  | 'isSelected'
  | 'markModified'
  | 'modifiedPaths'
  | 'populate'
  | 'populated'
  | 'set'
  | 'toJSON'
  | 'toObject'
  | 'toString'
  | 'unmarkModified'
  | 'replaceOne'
  | 'update'
  | 'updateOne'
  | 'validate'
  | 'validateSync'
  | 'errors'
  | 'isNew'
  | 'schema'
  | 'addListener'
  | 'on'
  | 'once'
  | 'removeListener'
  | 'off'
  | 'removeAllListeners'
  | 'setMaxListeners'
  | 'getMaxListeners'
  | 'listeners'
  | 'rawListeners'
  | 'emit'
  | 'listenerCount'
  | 'prependListener'
  | 'prependOnceListener'
  | 'eventNames'
  | 'id'
  | 'base'
  | 'baseModelName'
  | 'collection'
  | 'db'
  | 'discriminators'
  | 'modelName'
  | '__v'
  | 'createdAt'
  | 'updatedAt'
  | 'overwrite'
  | '$locals'
  | '_id'
>;
