import UserModel from '../models/user';
import { ReadingDiscordBot } from './discord';
import { UserDoc } from '../../typings';

const mutateUserDiscordContent = (userDoc: UserDoc) => {
  if (!userDoc) {
    return;
  }
  const client = ReadingDiscordBot.getInstance();
  const guild = client.guilds.first();
  const guildMember = guild.members.find(m => m.id === userDoc.id);
  if (guildMember) {
    userDoc.discordUsername = guildMember.user.username;
  }
};

export const getMe = async (id: string) => {
  const user = await UserModel.findById(id);
  mutateUserDiscordContent(user);
  return user;
};

export const getUser = async (slug: string) => {
  const user = await UserModel.findOne({ urlSlug: slug });
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
