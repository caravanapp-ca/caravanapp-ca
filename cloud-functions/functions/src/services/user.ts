import { GuildMember } from 'discord.js';

import { checkObjectIdIsValid } from '../workspace/mongo/common/mongoose';
// These imports will only exist after building
import { UserDoc, UserModel } from '../workspace/mongo/models/user';

export const getUserProfileUrl = (urlSlug: string) =>
  `https://caravanapp.ca/user/${urlSlug}`;

export const getUser = (urlSlugOrId: string) => {
  const isObjId = checkObjectIdIsValid(urlSlugOrId);
  if (!isObjId) {
    return UserModel.findOne({ urlSlug: urlSlugOrId });
  } else {
    return UserModel.findById(urlSlugOrId);
  }
};

export const getUsername = (userDoc?: UserDoc, member?: GuildMember) => {
  const username =
    userDoc && userDoc.name
      ? userDoc.name
      : member && member.displayName
      ? member.displayName
      : undefined;
  return username;
};
