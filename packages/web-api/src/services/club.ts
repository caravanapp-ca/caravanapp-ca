import {
  ShelfEntry,
  Services,
  SameKeysAs,
  Club,
  ClubWithRecommendation,
} from '@caravan/buddy-reading-types';
import { getUser, getUsername } from './user';
import {
  ClubDoc,
  ClubRecommendationDoc,
  ClubModel,
} from '@caravan/buddy-reading-mongo';
import { Types } from 'mongoose';
import { ReadingDiscordBot } from './discord';
import {
  PROD_UNCOUNTABLE_IDS,
  CLUB_RECOMMENDATION_KEYS,
} from '../common/globalConstantsAPI';
import {
  Guild,
  TextChannel,
  GuildChannel,
  GuildMember,
  VoiceChannel,
} from 'discord.js';
import { getClubRecommendationDescription } from '../common/club';

const knownHttpsRedirects = ['http://books.google.com/books/'];

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
  clubsReceivedIds?: string[]
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
  const globalQuery: SameKeysAs<Partial<ClubDoc>> = {
    _id: {
      $nin: [
        ...clubsReceivedIds.map(cRId => new Types.ObjectId(cRId)),
        ...recommendedClubIds,
      ],
    },
    unlisted: false,
  };
  const client = ReadingDiscordBot.getInstance();
  const guild = client.guilds.first();
  const { discordId } = user;
  const channels = getUserChannels(guild, discordId, true);
  const channelIds = channels.map(c => c.id);
  globalQuery.channelId = {
    $nin: channelIds,
  };
  // Array params must correspond with the order of CLUB_RECOMMENDATION_KEYS
  // See globalConstantsAPI.ts
  const isAggregation: boolean[] = [false, true, true, false];
  const aggregateMatches = [
    null,
    {
      $match: {
        ...globalQuery,
        'newShelf.notStarted.sourceId': { $in: userTBRSourceIds },
      },
    },
    {
      $match: {
        ...globalQuery,
        'genres.key': { $in: userGenreKeys },
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
                { $size: '$newShelf.notStarted.sourceId' },
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
                { $size: '$genres.key' },
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
  const sorts: any[] = [
    { createdAt: -1 },
    { $sort: { order: -1, createdAt: -1 } },
    { $sort: { order: -1, createdAt: -1 } },
    { createdAt: -1 },
  ];
  const limits: any[] = [
    limit - recommendedClubs.length,
    { $limit: limit - recommendedClubs.length },
    { $limit: limit - recommendedClubs.length },
    limit - recommendedClubs.length,
  ];
  const dbActions: any[] = [
    ClubModel.find({ ...globalQuery, ...findQueries[0] })
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
    ClubModel.find({ ...globalQuery, ...findQueries[3] })
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
      const transformedClubs = await Promise.all(transformedClubsPromises);
      recommendedClubs = recommendedClubs.concat(transformedClubs);
      const clubsToAddIds = clubDocs.map(c => c._id);
      recommendedClubIds = recommendedClubIds.concat(clubsToAddIds);
    }
    stepNum++;
  }
  return recommendedClubs;
};

// Transforms type ClubDoc[] into type Services.GetClubs['clubs']
export const transformToGetClubs = async (
  clubDocs: ClubDoc[]
): Promise<Services.GetClubs['clubs']> => {
  const client = ReadingDiscordBot.getInstance();
  const guild = client.guilds.first();
  const mutatedClubsPromises = clubDocs.map(cDoc =>
    transformSingleToGetClub(cDoc, guild)
  );
  let mutatedClubs = await Promise.all(mutatedClubsPromises);
  mutatedClubs = mutatedClubs.filter(c => c !== null);
  return mutatedClubs;
};

export const transformSingleToGetClub = async (cDoc: ClubDoc, guild: Guild) => {
  const discordChannel = guild.channels.get(cDoc.channelId);
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
  const ownerMember = guild.members.get(cDoc.ownerDiscordId);
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

export const getCountableMembersInChannel = (
  discordChannel: GuildChannel,
  club: ClubDoc
) =>
  (discordChannel as TextChannel | VoiceChannel).members.filter(m =>
    isInChannel(m, club)
  );

export const getUserChannels = (
  guild: Guild,
  discordId: string,
  inChannels: boolean
) => {
  const channels = guild.channels.filter(c => {
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
  (member.highestRole.name !== 'Admin' || club.ownerDiscordId === member.id) &&
  !member.user.bot;

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
