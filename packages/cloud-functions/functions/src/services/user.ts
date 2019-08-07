import {
  checkObjectIdIsValid,
  UserDoc,
  UserModel,
} from '@caravan/buddy-reading-mongo';
import { GuildMember } from 'discord.js';

export const getUserProfileUrl = (urlSlug: string) => `https://caravanapp.ca/users/${urlSlug}`;

export const getUser = async (urlSlugOrId: string) => {
  const isObjId = checkObjectIdIsValid(urlSlugOrId);
  let user: UserDoc | null;
  if (!isObjId) {
    user = await UserModel.findOne({ urlSlug: urlSlugOrId });
  } else {
    user = await UserModel.findById(urlSlugOrId);
  }
  return user;
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
