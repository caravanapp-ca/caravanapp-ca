import { GuildMember, Guild } from 'discord.js';
import {
  checkObjectIdIsValid,
  BadgeDoc,
  UserDoc,
  UserModel,
} from '@caravan/buddy-reading-mongo';
import { ReadingDiscordBot } from './discord';
import { getBadges } from './badge';

export const mutateUserDiscordContent = (userDoc: UserDoc, guild?: Guild) => {
  if (!userDoc) {
    return;
  }
  let g = guild;
  if (!g) {
    const client = ReadingDiscordBot.getInstance();
    g = client.guilds.first();
  }
  const guildMember = g.members.get(userDoc.discordId);
  if (guildMember) {
    const { user } = guildMember;
    userDoc.name = userDoc.name || guildMember.displayName;
    userDoc.discordUsername = guildMember.displayName;
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

export const mutateUserBadges = (
  userDocs: UserDoc[] | UserDoc,
  badgeDoc: BadgeDoc
) => {
  if (Array.isArray(userDocs)) {
    userDocs.forEach(ud => {
      mutateSingleUsersBadges(ud, badgeDoc);
    });
  } else {
    mutateSingleUsersBadges(userDocs, badgeDoc);
  }
};

export const getMe = async (id: string) => {
  const user = await UserModel.findById(id);
  mutateUserDiscordContent(user);
  return user;
};

export const getUsersByUserIds = async (userIds: string[]) => {
  const [userDocs, badgeDoc] = await Promise.all([
    UserModel.find({
      _id: {
        $in: userIds,
      },
    }),
    getBadges(),
  ]);
  const client = ReadingDiscordBot.getInstance();
  const guild = client.guilds.first();
  userDocs.forEach(userDoc => {
    mutateUserDiscordContent(userDoc, guild);
    if (userDoc && userDoc.badges && userDoc.badges.length > 0) {
      mutateUserBadges(userDoc, badgeDoc);
    }
    return userDoc;
  });
  return userDocs;
};

export const getUser = async (urlSlugOrId: string) => {
  const isObjId = checkObjectIdIsValid(urlSlugOrId);
  const userPromise = isObjId
    ? UserModel.findById(urlSlugOrId)
    : UserModel.findOne({ urlSlug: urlSlugOrId });
  const [userDoc, badgeDoc] = await Promise.all([userPromise, getBadges()]);
  mutateUserDiscordContent(userDoc);
  if (userDoc && userDoc.badges && userDoc.badges.length > 0) {
    mutateUserBadges(userDoc, badgeDoc);
  }
  return userDoc;
};

export const getUsername = (userDoc?: UserDoc, member?: GuildMember) => {
  const username: string =
    userDoc && userDoc.name
      ? userDoc.name
      : member && member.user && member.user.username
      ? member.user.username
      : undefined;
  return username;
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
