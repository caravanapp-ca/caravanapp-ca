import { GuildMember } from 'discord.js';
// These imports will only exist after building
import { UserDoc, UserModel } from '../workspace/mongo/models/user';
import { checkObjectIdIsValid } from '../workspace/mongo/common/mongoose';

export const getUserProfileUrl = (urlSlug: string) =>
  `https://caravanapp.ca/users/${urlSlug}`;

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
      : member && member.user && member.user.username
      ? member.user.username
      : undefined;
  return username;
};
