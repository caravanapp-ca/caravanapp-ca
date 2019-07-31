import UserModel from '../models/user';
import BadgeModel from '../models/badge';
import { ReadingDiscordBot } from './discord';
import { UserDoc, BadgeDoc } from '../../typings';
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

const mutateSingleUsersBadges = (ud: UserDoc, allBadges: BadgeDoc) => {
  const mutantBadges = ud.badges.map(userBadge => {
    if (!allBadges.badges[userBadge.key]) {
      console.error(
        `User ${ud.name || ud.discordUsername} (${
          ud._id
        }) has an invalid badge: ${userBadge.key}`
      );
      return;
    }
    return {
      // TODO: TS doesn't believe .toObject() exists on userBadge.
      //@ts-ignore
      ...userBadge.toObject(),
      name: allBadges.badges[userBadge.key].name,
      description: allBadges.badges[userBadge.key].description,
    };
  });
  ud.badges = mutantBadges;
};

export const mutateUserBadges = async (userDocs: UserDoc[] | UserDoc) => {
  const badgeDocs = await BadgeModel.findOne();
  if (!badgeDocs) {
    console.error('Found no badges in database!');
    return;
  }
  const allBadges = badgeDocs;
  if (Array.isArray(userDocs)) {
    userDocs.forEach(ud => {
      if (ud.badges.length > 0) {
        mutateSingleUsersBadges(ud, allBadges);
      }
    });
  } else {
    mutateSingleUsersBadges(userDocs, allBadges);
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
