import UserModel from '../models/user';
import BadgeModel from '../models/badge';
import { ReadingDiscordBot } from './discord';
import { UserDoc } from '../../typings';
import { checkObjectIdIsValid } from '../common/mongoose';
import { UserBadge } from '@caravan/buddy-reading-types';

export const mutateUserDiscordContent = (userDoc: UserDoc) => {
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

export const mutateUserBadges = async (userDoc: UserDoc) => {
  const { badges } = userDoc;
  if (badges.length === 0) {
    console.log('Attempted to mutate user badges with an empty badge array.');
    return;
  }
  const badgeDocs = await BadgeModel.find();
  if (badgeDocs.length === 0) {
    console.error('Found no badges in database!');
    return;
  }
  const allBadges = badgeDocs[0];
  const newBadges = badges.map(ub => {
    if (!allBadges.badges[ub.key]) {
      console.error(
        `User ${userDoc.name || userDoc.discordUsername} (${
          userDoc._id
        }) has an invalid badge: ${ub.key}`
      );
      return;
    }
    return {
      // @ts-ignore
      ...ub.toObject(),
      name: allBadges.badges[ub.key].name,
      description: allBadges.badges[ub.key].description,
    };
  });
  userDoc.badges = newBadges;
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
  if (user.badges.length > 0) {
    await mutateUserBadges(user);
  }
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
