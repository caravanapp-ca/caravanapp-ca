import UserModel from '../models/user';
import { ReadingDiscordBot } from './discord';
import { UserDoc } from '../../typings';
import { checkObjectIdIsValid } from '../common/mongoose';

const mutateUserDiscordContent = (userDoc: UserDoc) => {
  if (!userDoc) {
    return;
  }
  const client = ReadingDiscordBot.getInstance();
  const guild = client.guilds.first();
  const guildMember = guild.members.find(m => m.id === userDoc.discordId);
  if (guildMember) {
    const { user } = guildMember;
    userDoc.name = userDoc.name || user.username;
    userDoc.discordUsername = user.username;
    userDoc.photoUrl =
      userDoc.photoUrl || user.avatarURL || user.defaultAvatarURL;
  }
};

export const getMe = async (id: string) => {
  const user = await UserModel.findById(id);
  mutateUserDiscordContent(user);
  return user;
};

export const getUser = async (urlSlugOrId: string) => {
  const isObjId = checkObjectIdIsValid(urlSlugOrId);
  let user: UserDoc;
  if (!isObjId) {
    user = await UserModel.findOne({ urlSlug: urlSlugOrId });
  } else {
    user = await UserModel.findById(urlSlugOrId);
  }
  mutateUserDiscordContent(user);
  return user;
};

export const getUserByDiscordId = async (discordId: string) => {
  const user = await UserModel.findOne({ discordId });
  mutateUserDiscordContent(user);
  return user;
};

export const userSlugExists = async (urlSlug: string) =>
  !!(await UserModel.findOne({ urlSlug: { $eq: urlSlug } }).lean());

export const getAvailableSlugIds = async (slugIds: string[]) => {
  const unavailableSlugs: { urlSlug: string }[] = await UserModel.find({
    urlSlug: { $in: slugIds },
  })
    .select({ urlSlug: 1 })
    .lean()
    .exec();
  return slugIds.filter(s => !unavailableSlugs.find(us => us.urlSlug === s));
};
