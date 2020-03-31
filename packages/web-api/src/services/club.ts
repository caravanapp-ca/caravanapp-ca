import { AxiosResponse } from 'axios';
import { addDays } from 'date-fns';
import {
  Guild,
  GuildChannel,
  GuildMember,
  TextChannel,
  VoiceChannel,
} from 'discord.js';
import { Types } from 'mongoose';

import {
  ClubDoc,
  ClubModel,
  ClubRecommendationDoc,
  ReferralDoc,
  UserDoc,
  UserModel,
} from '@caravanapp/mongo';
import {
  Club,
  ClubRecommendation,
  ClubRecommendationKey,
  ClubWithRecommendation,
  PubSub,
  Services,
  ShelfEntry,
  User,
} from '@caravanapp/types';

import { getClubRecommendationDescription } from '../common/club';
import {
  CLUB_RECOMMENDATION_KEYS,
  MAX_CLUB_AGE_RECOMMENDATION_DAYS,
  PROD_UNCOUNTABLE_IDS,
  UNLIMITED_CLUB_MEMBERS_VALUE,
} from '../common/globalConstantsAPI';
import { pubsubClient } from '../common/pubsub';
import { getBadges } from './badge';
import { ReadingDiscordBot } from './discord';
import { createReferralAction } from './referral';
import { getUser, getUsername, mutateUserBadges } from './user';

const knownHttpsRedirects = ['http://books.google.com/books/'];

export const getClub = (clubId: Types.ObjectId | string) => {
  return ClubModel.findById(clubId);
};

export const getUserChannels = (
  guild: Guild,
  discordId: string,
  inChannels: boolean
) => {
  const channels = guild.channels.cache.filter(c => {
    if (c.type === 'text' || c.type === 'voice') {
      const inThisChannel = !!(c as TextChannel).members.get(discordId);
      return inChannels === inThisChannel;
    } else {
      return false;
    }
  });
  return channels;
};

const isInChannel = (member: GuildMember, club: ClubDoc) =>
  (member.roles.highest.name !== 'Admin' ||
    club.ownerDiscordId === member.id) &&
  !member.user.bot;

export const getCountableMembersInChannel = (
  discordChannel: GuildChannel,
  club: ClubDoc
) =>
  (discordChannel as TextChannel | VoiceChannel).members.filter(m =>
    isInChannel(m, club)
  );

// For speed purposes, we can guarantee that in prod environments there are always
// 3 less members than what are shown due to bots and the admin. In testing,
// quinn's account and matt's account are admins so we need to perform the full countable
// members check. Well, we don't need to, but it's OK for now.
export const getMemberCount = (
  discordChannel: GuildChannel,
  clubDoc: ClubDoc
) =>
  process.env.GAE_ENV === 'production'
    ? (discordChannel as TextChannel).members.size - PROD_UNCOUNTABLE_IDS.length
    : getCountableMembersInChannel(discordChannel, clubDoc).size;

export const transformSingleToGetClub = async (
  cDoc: ClubDoc,
  guild: Guild
): Promise<Services.GetClubs['clubs'][0] | null> => {
  const discordChannel = guild.channels.cache.get(cDoc.channelId);
  if (!discordChannel) {
    console.error(`No discord channel found for club ${cDoc.id}`);
    return null;
  }
  const memberCount = getMemberCount(discordChannel, cDoc);
  const ownerDoc = await getUser(cDoc.ownerId);
  if (!ownerDoc) {
    console.error(`Unable to find user doc for user ${cDoc.ownerId}`);
    return null;
  }
  const ownerMember = guild.members.cache.get(cDoc.ownerDiscordId);
  if (!ownerMember) {
    console.error(`Unable to find guild member for user ${cDoc.ownerId}`);
    return null;
  }
  const ownerName = getUsername(ownerDoc, ownerMember);
  const guildId = guild.id;
  const doc = typeof cDoc.toObject === 'function' ? cDoc.toObject() : cDoc;
  const club: Omit<Club, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
  } = {
    ...doc,
    createdAt:
      cDoc.createdAt instanceof Date
        ? cDoc.createdAt.toISOString()
        : cDoc.createdAt,
    updatedAt:
      cDoc.updatedAt instanceof Date
        ? cDoc.updatedAt.toISOString()
        : cDoc.updatedAt,
  };
  const mutatedClub: Services.GetClubs['clubs'][0] = {
    ...club,
    guildId,
    memberCount,
    ownerName,
  };
  return mutatedClub;
};

// Recommendation logic v1
// Need to recommend n clubs. Stop when you have found n matching clubs.
// 1. Recommend clubs that are currently reading a book on your TBR
// 2. Recommend clubs that have books on your TBR on their TBR (sort by most matches)
// 3. Recommend clubs that match any of your genres (sort by most matches)
// 4. Finally, recommend the newest clubs.
// If userId is provided in props, then recommend clubs for that user
// Else, recommend clubs for the current user
export const getUserClubRecommendations = async (
  userId: string,
  limit: number,
  blockedClubIds?: string[]
): Promise<ClubWithRecommendation[]> => {
  const user = await getUser(userId);
  if (!user) {
    console.error(`Unable to find user ${userId}`);
    return [];
  }
  let recommendedClubs: ClubWithRecommendation[] = [];
  let recommendedClubIds: Types.ObjectId[] = [];
  const userTBRSourceIds = user.shelf.notStarted.map(tbr => tbr.sourceId);
  const userGenreKeys = user.selectedGenres.map(sg => sg.key);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalQuery: any = {
    _id: {
      $nin: [
        ...blockedClubIds.map(cRId => new Types.ObjectId(cRId)),
        ...recommendedClubIds,
      ],
    },
    unlisted: false,
    $or: [
      {
        createdAt: {
          $gte: addDays(new Date(), -MAX_CLUB_AGE_RECOMMENDATION_DAYS),
        },
      },
      {
        'schedules.startDate': {
          $gte: new Date(),
        },
      },
    ],
  };
  const client = ReadingDiscordBot.getInstance();
  const guild = client.guilds.cache.first();
  const { discordId } = user;
  const channels = getUserChannels(guild, discordId, true);
  const channelIds = channels.map(c => c.id);
  globalQuery.channelId = {
    $nin: channelIds,
  };
  // Array params must correspond with the order of CLUB_RECOMMENDATION_KEYS
  // See globalConstantsAPI.ts
  const aggregateMatches = [
    null,
    {
      $match: {
        ...globalQuery,
        'newShelf.notStarted.sourceId': {
          $in: userTBRSourceIds,
        },
      },
    },
    {
      $match: {
        ...globalQuery,
        'genres.key': {
          $in: userGenreKeys,
        },
      },
    },
    null,
  ];
  const aggregateProjections = [
    null,
    {
      $addFields: {
        order: {
          $multiply: [
            // Num matches
            {
              $size: {
                $setIntersection: [
                  userTBRSourceIds,
                  '$newShelf.notStarted.sourceId',
                ],
              },
            },
            // Match ratio
            {
              $divide: [
                {
                  $size: {
                    $setIntersection: [
                      userTBRSourceIds,
                      '$newShelf.notStarted.sourceId',
                    ],
                  },
                },
                {
                  $size: '$newShelf.notStarted.sourceId',
                },
              ],
            },
          ],
        },
        tbrMatches: {
          $setIntersection: [userTBRSourceIds, '$newShelf.notStarted.sourceId'],
        },
      },
    },
    {
      $addFields: {
        order: {
          $multiply: [
            // Num matches
            {
              $size: {
                $setIntersection: [userGenreKeys, '$genres.key'],
              },
            },
            // Match ratio
            {
              $divide: [
                {
                  $size: {
                    $setIntersection: [userGenreKeys, '$genres.key'],
                  },
                },
                {
                  $size: '$genres.key',
                },
              ],
            },
          ],
        },
        genreMatches: {
          $setIntersection: [userGenreKeys, '$genres.key'],
        },
      },
    },
    null,
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const findQueries: any[] = [
    {
      'newShelf.current.sourceId': {
        $in: userTBRSourceIds,
      },
    },
    null,
    null,
    {},
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sorts: any[] = [
    { createdAt: -1 },
    {
      $sort: {
        order: -1,
        createdAt: -1,
      },
    },
    {
      $sort: {
        order: -1,
        createdAt: -1,
      },
    },
    { createdAt: -1 },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const limits: any[] = [
    limit - recommendedClubs.length,
    {
      $limit: limit - recommendedClubs.length,
    },
    {
      $limit: limit - recommendedClubs.length,
    },
    limit - recommendedClubs.length,
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbActions: any[] = [
    ClubModel.find({
      ...globalQuery,
      ...findQueries[0],
    })
      .sort(sorts[0])
      .limit(limits[0])
      .exec(),
    ClubModel.aggregate([
      aggregateMatches[1],
      aggregateProjections[1],
      sorts[1],
      limits[1],
    ]),
    ClubModel.aggregate([
      aggregateMatches[2],
      aggregateProjections[2],
      sorts[2],
      limits[2],
    ]),
    ClubModel.find({
      ...globalQuery,
      ...findQueries[3],
    })
      .sort(sorts[3])
      .limit(limits[3])
      .exec(),
  ];
  const numSteps = CLUB_RECOMMENDATION_KEYS.length;
  let stepNum = 0;
  while (recommendedClubs.length < limit && stepNum < numSteps) {
    let clubDocs = (await dbActions[stepNum]) as ClubRecommendationDoc[];
    if (clubDocs.length > limit - recommendedClubs.length) {
      clubDocs = clubDocs.slice(0, limit - recommendedClubs.length);
    }
    if (clubDocs.length > 0) {
      const transformedClubsPromises = clubDocs.map(async cDoc => {
        const tbrMatches =
          stepNum === 0 && cDoc.newShelf.current.length > 0
            ? [cDoc.newShelf.current[0]]
            : cDoc.tbrMatches && cDoc.tbrMatches.length > 0
            ? user.shelf.notStarted.filter(b =>
                cDoc.tbrMatches.includes(b.sourceId)
              )
            : [];
        const genreMatches =
          cDoc.genreMatches && cDoc.genreMatches.length > 0
            ? user.selectedGenres.filter(sg =>
                cDoc.genreMatches.includes(sg.key)
              )
            : [];
        const bookTitles = tbrMatches.map(tbr => tbr.title);
        const genreNames = genreMatches.map(g => g.name);
        return {
          club: await transformSingleToGetClub(cDoc, guild),
          recommendation: {
            key: CLUB_RECOMMENDATION_KEYS[stepNum],
            description: getClubRecommendationDescription(
              CLUB_RECOMMENDATION_KEYS[stepNum],
              bookTitles,
              genreNames
            ),
          },
          tbrMatches,
          genreMatches,
          isMember: false,
        };
      });
      const transformedClubsWNulls = await Promise.all(
        transformedClubsPromises
      );
      const transformedClubs = transformedClubsWNulls.filter(
        tc => tc.club !== null
      );
      recommendedClubs = recommendedClubs.concat(transformedClubs);
      const clubsToAddIds = clubDocs.map(c => c._id);
      recommendedClubIds = recommendedClubIds.concat(clubsToAddIds);
    }
    stepNum++;
  }
  return recommendedClubs;
};

export const isInClub = (user: UserDoc, club: ClubDoc, guild: Guild) => {
  const discordChannel: GuildChannel | undefined = guild.channels.cache.get(
    club.channelId
  );
  if (!discordChannel) {
    console.error(`Unable to find Discord channel for club ${club.id}`);
    return false;
  }
  const countableMembers = getCountableMembersInChannel(discordChannel, club);
  return countableMembers.has(user.discordId);
};

export const getClubRecommendationFromReferral = async (
  userDoc: UserDoc,
  referralDoc: ReferralDoc,
  clubDoc: ClubDoc
): Promise<ClubWithRecommendation> => {
  const client = ReadingDiscordBot.getInstance();
  const guild = client.guilds.cache.first();
  const { referredById: referrerUserId } = referralDoc;
  const referrerUserDoc = await getUser(referrerUserId);
  const recommendationKey: ClubRecommendationKey = 'referral';
  const recommendation: ClubRecommendation = {
    key: recommendationKey,
    description: getClubRecommendationDescription(
      recommendationKey,
      undefined,
      undefined,
      referrerUserDoc
    ),
  };
  const isMember = isInClub(userDoc, clubDoc, guild);
  return {
    club: await transformSingleToGetClub(clubDoc, guild),
    genreMatches: [],
    tbrMatches: [],
    recommendation,
    isMember,
  };
};

export const getChannelMembers = async (guild: Guild, club: ClubDoc) => {
  const discordChannel = guild.channels.cache.get(club.channelId);
  if (discordChannel.type !== 'text' && discordChannel.type !== 'voice') {
    return;
  }
  const guildMembers = getCountableMembersInChannel(
    discordChannel,
    club
  ).array();
  const guildMemberDiscordIds = guildMembers.map(m => m.id);
  const [userDocs, badgeDoc] = await Promise.all([
    UserModel.find({
      discordId: { $in: guildMemberDiscordIds },
      isBot: { $eq: false },
    }),
    getBadges(),
  ]);
  mutateUserBadges(userDocs, badgeDoc);
  const users = guildMembers
    .map(mem => {
      const user = userDocs.find(u => u.discordId === mem.id);
      if (user) {
        const userObj: User = user.toObject();
        const result: User = {
          ...userObj,
          name: userObj.name ? userObj.name : mem.user.username,
          discordUsername: mem.user.username,
          discordId: mem.id,
          photoUrl:
            user.photoUrl ||
            mem.user.avatarURL() ||
            mem.user.displayAvatarURL() ||
            mem.user.defaultAvatarURL,
        };
        return result;
      } else {
        // Handle case where a user comes into discord without creating an account
        // i.e. create a shadow account
        console.error('Create a shadow account');
        return null;
      }
    })
    .filter(g => g !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
  return users;
};

export const modifyClubMembership = async (
  userId: string,
  userDiscordId: string,
  clubId: string | Types.ObjectId,
  isMember: boolean
): Promise<Pick<AxiosResponse, 'status' | 'data'>> => {
  const club = await getClub(clubId);
  if (!club) {
    return {
      status: 404,
      data: `Could not find club ${clubId}`,
    };
  }
  const isOwner = club.ownerId === userId;
  const discordClient = ReadingDiscordBot.getInstance();
  const guild = discordClient.guilds.cache.first();
  const channel: GuildChannel = guild.channels.cache.get(club.channelId);
  if (!channel) {
    return {
      status: 400,
      data: `Channel was deleted, clubId: ${club.id}`,
    };
  }
  const memberInChannel = channel.members.get(userDiscordId);
  if (isMember) {
    // Trying to add to members
    const { size } = getCountableMembersInChannel(channel, club);
    if (memberInChannel) {
      // already a member
      return {
        status: 401,
        data: "You're already a member of the club!",
      };
    } else if (
      club.maxMembers !== UNLIMITED_CLUB_MEMBERS_VALUE &&
      size >= club.maxMembers
    ) {
      return {
        status: 401,
        data: `There are already ${size}/${club.maxMembers} people in the club.`,
      };
    } else {
      const permissions = channel.permissionsFor(memberInChannel);
      if (permissions && permissions.has('VIEW_CHANNEL')) {
        return { status: 401, data: 'You already have access to the channel!' };
      }
      await channel.updateOverwrite(userDiscordId, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        SEND_TTS_MESSAGES: true,
        MANAGE_MESSAGES: isOwner,
      });
      createReferralAction(userId, 'joinClub');
      const pubsub = pubsubClient.getInstance();
      const topic: PubSub.Topic = 'club-membership';
      const message: PubSub.Message.ClubMembershipChange = {
        userId: userId,
        clubId: club.id,
        clubMembership: 'joined',
      };
      const buffer = Buffer.from(JSON.stringify(message));
      pubsub.topic(topic).publish(buffer);
    }
  } else {
    if (isOwner) {
      return {
        status: 401,
        data: 'An owner cannot leave a club.',
      };
    }
    if (!memberInChannel) {
      return {
        status: 401,
        data: "You're already not a member of the club!",
      };
    }
    await channel.updateOverwrite(userDiscordId, {
      VIEW_CHANNEL: false,
      SEND_MESSAGES: false,
      SEND_TTS_MESSAGES: false,
      MANAGE_MESSAGES: false,
    });
    const pubsub = pubsubClient.getInstance();
    const topic: PubSub.Topic = 'club-membership';
    const message: PubSub.Message.ClubMembershipChange = {
      userId: userId,
      clubId: club.id,
      clubMembership: 'left',
    };
    const buffer = Buffer.from(JSON.stringify(message));
    pubsub.topic(topic).publish(buffer);
  }
  // Don't remove this line! This updates the Discord member objects internally, so we can access all users.
  await guild.members.fetch();
  const members = await getChannelMembers(guild, club);
  return {
    status: 200,
    data: members,
  };
};

// Transforms type ClubDoc[] into type Services.GetClubs['clubs']
export const transformToGetClubs = async (
  clubDocs: ClubDoc[]
): Promise<Services.GetClubs['clubs']> => {
  const client = ReadingDiscordBot.getInstance();
  const guild = client.guilds.cache.first();
  const mutatedClubsPromises = clubDocs.map(cDoc =>
    transformSingleToGetClub(cDoc, guild)
  );
  let mutatedClubs = await Promise.all(mutatedClubsPromises);
  mutatedClubs = mutatedClubs.filter(c => c !== null);
  return mutatedClubs;
};

export const getClubUrl = (clubId: string) =>
  `https://caravanapp.ca/clubs/${clubId}`;

// 1024 is Discord limit, so shorten the bio by the club url and two
// for new lines.
export const getDefaultClubTopic = (clubUrl: string, bio: string) =>
  `${clubUrl}\n\n${bio.substr(0, 1024 - clubUrl.length - 2)}`;

export const shelfEntryWithHttpsBookUrl = (shelfEntry: ShelfEntry) => {
  if (
    shelfEntry &&
    shelfEntry.coverImageURL &&
    knownHttpsRedirects.find(url => shelfEntry.coverImageURL.startsWith(url))
  ) {
    const newItem: ShelfEntry = {
      ...shelfEntry,
      coverImageURL: shelfEntry.coverImageURL.replace('http:', 'https:'),
    };
    return newItem;
  }
  return shelfEntry;
};
