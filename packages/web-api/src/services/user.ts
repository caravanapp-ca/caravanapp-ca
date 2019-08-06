import { GuildMember } from 'discord.js';
import { checkObjectIdIsValid, BadgeDoc, UserDoc, UserModel } from '@caravan/buddy-reading-mongo';
import { ReadingDiscordBot } from './discord';
import { getBadges } from './badge';

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

export const getUser = async (urlSlugOrId: string) => {
  const isObjId = checkObjectIdIsValid(urlSlugOrId);
  let user: UserDoc;
  if (!isObjId) {
    user = await UserModel.findOne({ urlSlug: urlSlugOrId });
  } else {
    user = await UserModel.findById(urlSlugOrId);
  }
  mutateUserDiscordContent(user);
  const badgeDoc = await getBadges();
  if (user.badges.length > 0) {
    mutateUserBadges(user, badgeDoc);
  }
  return user;
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
