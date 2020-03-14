import {
  ChannelCreationOverwrites,
  ChannelData,
  Guild,
  GuildChannel,
  GuildMember,
  PermissionResolvable,
  TextChannel,
  VoiceChannel,
} from 'discord.js';
import express from 'express';
import { check, oneOf, validationResult } from 'express-validator';
import Fuse from 'fuse.js';
import { Types } from 'mongoose';

import { ClubDoc, ClubModel, UserDoc, UserModel } from '@caravanapp/mongo';
import {
  ActiveFilter,
  Club,
  ClubShelf,
  FilterAutoMongoKeys,
  GroupVibe,
  ReadingSpeed,
  SameKeysAs,
  Services,
  User,
} from '@caravanapp/types';

import {
  MAX_SHELF_SIZE,
  UNLIMITED_CLUB_MEMBERS_VALUE,
  VALID_READING_STATES,
} from '../common/globalConstantsAPI';
import { isAuthenticated } from '../middleware/auth';
import {
  getChannelMembers,
  getClub,
  getClubRecommendationFromReferral,
  getClubUrl,
  getCountableMembersInChannel,
  getDefaultClubTopic,
  getMemberCount,
  getUserChannels,
  getUserClubRecommendations,
  modifyClubMembership,
  shelfEntryWithHttpsBookUrl,
} from '../services/club';
import { ReadingDiscordBot } from '../services/discord';
import { createReferralAction, getReferralDoc } from '../services/referral';
import { getUser, getUsername } from '../services/user';

const router = express.Router();

const getValidShelfFromNewShelf = (newShelf: ClubShelf) => {
  const validShelf: ClubShelf = { notStarted: [], current: [], read: [] };
  VALID_READING_STATES.forEach(state => {
    if (Array.isArray(newShelf[state])) {
      let truncatedShelf = newShelf[state];
      if (truncatedShelf.length > MAX_SHELF_SIZE) {
        truncatedShelf = truncatedShelf.slice(0, MAX_SHELF_SIZE);
      }
      validShelf[state] = truncatedShelf.map(shelfEntryWithHttpsBookUrl);
    }
  });
  return validShelf;
};

/**
 * This returns a Map of UserDoc and GuildMember for each clubDoc.
 * The GuildMember may be null or undefined if the user has left
 * the guild. Currently, users are not deleted so UserDoc cannot be
 * undefined, but consider checking for it anyways.
 * @param guild the guild
 * @param clubDocs all club docs
 */
async function getClubOwnerMap(guild: Guild, clubDocs: ClubDoc[]) {
  const foundUsers = new Map<
    string,
    { userDoc: UserDoc; member: GuildMember }
  >();
  const foundUserIds: string[] = [];
  clubDocs.forEach(c => {
    if (!foundUsers.has(c.ownerId)) {
      const ownerMember = guild.members.get(c.ownerDiscordId);
      foundUsers.set(c.ownerId, { userDoc: null, member: ownerMember });
      foundUserIds.push(c.ownerId);
    }
  });
  const userDocs = await UserModel.find({ _id: { $in: foundUserIds } });
  userDocs.forEach(doc => (foundUsers.get(doc.id).userDoc = doc));
  return foundUsers;
}

router.get('/user/recommendations', async (req, res) => {
  const userId: unknown = req.query.userId;
  const pageSize: unknown = req.query.pageSize;
  const blockedClubIds: unknown = req.query.blockedClubIds;
  if (typeof pageSize !== 'string' || isNaN(parseInt(pageSize))) {
    res
      .status(400)
      .send('pageSize must be a string representation of a number.');
    return;
  }
  if (typeof userId !== 'string') {
    res.status(400).send('userId must be a string.');
    return;
  }
  if (!Types.ObjectId.isValid(userId)) {
    res.status(400).send(`userId ${userId} is not a valid mongo ObjectId.`);
    return;
  }
  const maxRecommendations = 50;
  const minRecommendations = 1;
  const defaultRecommendations = 4;
  const limitToUse = pageSize
    ? Math.max(
        Math.min(parseInt(pageSize), maxRecommendations),
        minRecommendations
      )
    : defaultRecommendations;
  const blockedClubIdsArr: string[] =
    blockedClubIds && typeof blockedClubIds === 'string'
      ? blockedClubIds.split(',')
      : [];
  const recommendedClubs = await getUserClubRecommendations(
    userId,
    limitToUse,
    blockedClubIdsArr
  );
  if (recommendedClubs.length === 0) {
    console.warn(`Found no recommended clubs for user ${userId}`);
    res.status(200).send([]);
    return;
  }
  res.status(200).send(recommendedClubs);
});

router.get('/user/referrals', async (req, res) => {
  const { userId } = req.session;
  if (!userId) {
    res.status(400).send('Require a userId');
    return;
  }
  if (typeof userId !== 'string') {
    res.status(400).send('userId must be a string.');
    return;
  }
  if (!Types.ObjectId.isValid(userId)) {
    res.status(400).send(`userId ${userId} is not a valid mongo ObjectId.`);
    return;
  }
  const [userDoc, referralDoc] = await Promise.all([
    getUser(userId),
    getReferralDoc(userId),
  ]);
  if (!userDoc) {
    res.status(404).send(`Unable to find user ${userId}`);
    return;
  }
  if (!referralDoc) {
    res.status(404).send(`User ${userId} does not have a referral doc.`);
  }
  if (
    referralDoc.referralDestination !== 'club' ||
    !referralDoc.referralDestinationId
  ) {
    res.status(200).send(undefined);
    return;
  }
  const { referralDestinationId: clubId } = referralDoc;
  const clubDoc = await getClub(clubId);
  if (!clubDoc) {
    res.status(404).send(`Unable to find club ${clubId}. Has it been deleted?`);
    return;
  }
  const clubRecommendation = await getClubRecommendationFromReferral(
    userDoc,
    referralDoc,
    clubDoc
  );
  res.status(200).send(clubRecommendation);
});

router.get('/', async (req, res) => {
  const { userId, after, pageSize, activeFilter, search } = req.query;
  const isSearching = !!search;
  const currUserId = req.session.userId;
  const [currUser, user] = await Promise.all([
    currUserId ? await getUser(currUserId) : undefined,
    userId ? await getUser(userId) : undefined,
  ]);
  const query: SameKeysAs<Partial<Club>> = {};
  const sort: SameKeysAs<Partial<Club>> = {
    createdAt: -1,
  };
  if (!isSearching && after) {
    query._id = { $lt: after };
  }
  let userInChannelBoolean = true;
  let filterObj: ActiveFilter;
  if (activeFilter) {
    filterObj = JSON.parse(activeFilter);
    if (filterObj.speed.length > 0) {
      query.readingSpeed = { $eq: filterObj.speed[0].key };
    }
    if (filterObj.genres.length > 0) {
      const genreKeys = filterObj.genres.map(g => g.key);
      query.genres = { $elemMatch: { key: { $in: genreKeys } } };
    }
    if (
      filterObj.membership.length > 0 &&
      filterObj.membership[0].key === 'clubsImNotIn'
    ) {
      userInChannelBoolean = false;
    }
  }
  const client = ReadingDiscordBot.getInstance();
  const guild = client.guilds.first();
  if (user) {
    const { discordId } = user;
    const channels = getUserChannels(guild, discordId, userInChannelBoolean);
    const channelIds = channels.map(c => c.id);
    query.channelId = { $in: channelIds };
  }
  // Calculate number of documents to skip
  const size = Number.parseInt(pageSize || 0);
  const limit = Math.min(Math.max(size, 1), 50);
  let clubDocs: ClubDoc[];
  try {
    if (isSearching) {
      clubDocs = await ClubModel.find(query).sort(sort);
    } else {
      // The +12 is a safety net for clubs that get filtered out
      clubDocs = await ClubModel.find(query)
        .sort(sort)
        .limit(limit + 12);
    }
  } catch (err) {
    console.error('Failed to get clubs.', err);
    return res.status(500).send(`Failed to get clubs.`);
  }
  if (!clubDocs) {
    return res.sendStatus(404);
  }

  // Create a map of users found in the guild and attach the user doc
  const foundUsers = await getClubOwnerMap(guild, clubDocs);

  const capacityKeys =
    (filterObj &&
      Array.isArray(filterObj.capacity) &&
      filterObj.capacity.map(c => c.key)) ||
    [];
  const includesSpotsAvailable = capacityKeys.includes('spotsAvailable');
  const includesFull = capacityKeys.includes('full');

  let validClubCount = 0;
  let filteredClubsWithMemberCounts: Services.GetClubs['clubs'] = clubDocs
    .map(clubDoc => {
      // If found enough clubs (due to over-querying), stop looking.
      if (!isSearching && validClubCount === limit) {
        return null;
      }
      const discordChannel: GuildChannel | null = guild.channels.get(
        clubDoc.channelId
      );
      // If there's no Discord channel for this club, filter it out
      if (!discordChannel) {
        return null;
      }
      // If the club is unlisted and the current user is not in it, filter it out
      if (
        clubDoc.unlisted &&
        (!currUser ||
          !(discordChannel as TextChannel).members.get(currUser.discordId))
      ) {
        return null;
      }
      const memberCount = getMemberCount(discordChannel, clubDoc);
      if (
        (includesSpotsAvailable && memberCount >= clubDoc.maxMembers) ||
        (includesFull && memberCount < clubDoc.maxMembers)
      ) {
        return null;
      }

      const foundUser = foundUsers.get(clubDoc.ownerId);
      const ownerName =
        getUsername(foundUser.userDoc, foundUser.member) || 'caravan-admin';

      const club: Omit<Club, 'createdAt' | 'updatedAt'> & {
        createdAt: string;
        updatedAt: string;
      } = {
        ...clubDoc.toObject(),
        createdAt:
          clubDoc.createdAt instanceof Date
            ? clubDoc.createdAt.toISOString()
            : clubDoc.createdAt,
        updatedAt:
          clubDoc.updatedAt instanceof Date
            ? clubDoc.updatedAt.toISOString()
            : clubDoc.updatedAt,
      };
      const obj: Services.GetClubs['clubs'][0] = {
        ...club,
        ownerName,
        guildId: guild.id,
        memberCount,
      };
      validClubCount++;
      return obj;
    })
    .filter(c => c !== null);
  if (isSearching) {
    const fuseOptions = {
      keys: [
        { name: 'newShelf.current.title', weight: 3 / 9 },
        { name: 'name', weight: 2 / 9 },
        { name: 'newShelf.current.author', weight: 2 / 9 },
        { name: 'newShelf.notStarted.title', weight: 1 / 9 },
        { name: 'newShelf.notStarted.author', weight: 1 / 9 },
      ],
    };
    const fuse = new Fuse(filteredClubsWithMemberCounts, fuseOptions);
    filteredClubsWithMemberCounts = fuse.search(search);

    if (after) {
      const afterIndex = filteredClubsWithMemberCounts.findIndex(
        c => c._id.toString() === after
      );
      if (afterIndex >= 0) {
        filteredClubsWithMemberCounts = filteredClubsWithMemberCounts.slice(
          afterIndex + 1
        );
      }
    }
  }
  if (filteredClubsWithMemberCounts.length > limit) {
    filteredClubsWithMemberCounts = filteredClubsWithMemberCounts.slice(
      0,
      limit
    );
  }
  const result: Services.GetClubs = {
    clubs: filteredClubsWithMemberCounts,
  };
  return res.status(200).json(result);
});

// Get all of a user's clubs, with members attached.
// Quite heavyweight, use the route for without members above if you just need a member count
router.get('/wMembers/user/:userId', async (req, res) => {
  // Get query params.
  const { after, pageSize, activeFilter, search } = req.query;
  const { userId } = req.params;
  const currentUser = req.session.userId
    ? await UserModel.findById(req.session.userId)
    : null;
  let user: UserDoc | undefined;
  if (userId) {
    user = await getUser(userId);
  }
  if (!user) {
    return res
      .status(400)
      .send(
        `Could not find user while getting user's clubs: { userId: ${userId} }`
      );
  }
  // Apply necessary filters
  const query: SameKeysAs<Partial<Club>> = {
    channelSource: 'discord',
  };
  if ((!search || search.length === 0) && after) {
    query._id = { $lt: after };
  }
  let filterObj: ActiveFilter;
  let userInChannelBoolean = true;
  if (activeFilter) {
    filterObj = JSON.parse(activeFilter);
    if (filterObj.speed.length > 0) {
      query.readingSpeed = { $eq: filterObj.speed[0].key };
    }
    if (filterObj.genres.length > 0) {
      const genreKeys = filterObj.genres.map((g: { key: string }) => g.key);
      query.genres = { $elemMatch: { key: { $in: genreKeys } } };
    }
    if (
      filterObj.membership.length > 0 &&
      filterObj.membership[0].key === 'clubsImNotIn'
    ) {
      userInChannelBoolean = false;
    }
  }
  const client = ReadingDiscordBot.getInstance();
  const guild = client.guilds.first();
  const { discordId } = user;
  const channels = getUserChannels(guild, discordId, userInChannelBoolean);
  const channelIds = channels.map(c => c.id);
  query.channelId = { $in: channelIds };
  // Calculate number of results to return
  const size = Number.parseInt(pageSize || 0);
  const limit = Math.min(Math.max(size, 10), 50);
  let clubDocs: ClubDoc[];
  try {
    if (
      (search && search.length > 0) ||
      (filterObj && filterObj.capacity.length > 0)
    ) {
      clubDocs = await ClubModel.find(query)
        .sort({ createdAt: -1 })
        .exec();
    } else {
      clubDocs = await ClubModel.find(query)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();
    }
  } catch (err) {
    console.error(`Failed to get clubs for user ${user._id}`, err);
    return res.status(500).send(err);
  }
  if (!clubDocs) {
    return res.status(404).send(`No clubs exist for user ${userId}`);
  }
  const filteredClubsWithMembersNulls: (Services.GetClubById | null)[] = await Promise.all(
    clubDocs.map(async clubDoc => {
      const discordChannel: GuildChannel | null = guild.channels.get(
        clubDoc.channelId
      );
      // If there's no Discord channel for this club, filter it out
      if (!discordChannel) {
        return null;
      }
      // If the club is unlisted and I'm not in the club
      if (
        clubDoc.unlisted &&
        (!currentUser ||
          !(discordChannel as TextChannel).members.get(currentUser.discordId))
      ) {
        return null;
      }
      // Don't remove this line! This updates the Discord member objects internally, so we can access all users.
      await guild.fetchMembers();
      const guildMembers = await getChannelMembers(guild, clubDoc);
      if (filterObj && filterObj.capacity.length > 0) {
        const capacityKeys = filterObj.capacity.map(c => c.key);
        if (
          capacityKeys.includes('spotsAvailable') &&
          guildMembers.length >= clubDoc.maxMembers
        ) {
          return null;
        } else if (
          capacityKeys.includes('full') &&
          guildMembers.length < clubDoc.maxMembers
        ) {
          return null;
        }
      }
      return {
        ...clubDoc.toObject(),
        members: guildMembers,
        guildId: guild.id,
      };
    })
  );
  let filteredClubsWithMembers: Services.GetClubById[] = filteredClubsWithMembersNulls.filter(
    c => c != null
  );
  if (search && search.length > 0) {
    const fuseOptions = {
      keys: ['name', 'shelf.title', 'shelf.author'],
    };
    const fuse = new Fuse(filteredClubsWithMembers, fuseOptions);
    filteredClubsWithMembers = fuse.search(search);
  }
  if (
    (!search ||
      search.length > 0 ||
      (filterObj && filterObj.capacity.length > 0)) &&
    after
  ) {
    const afterIndex = filteredClubsWithMembers.findIndex(
      c => c._id.toString() === after
    );
    if (afterIndex >= 0) {
      filteredClubsWithMembers = filteredClubsWithMembers.slice(afterIndex + 1);
    }
  }
  if (filteredClubsWithMembers.length > limit) {
    filteredClubsWithMembers = filteredClubsWithMembers.slice(0, limit);
  }
  const result: Services.GetClubById[] = filteredClubsWithMembers;
  return res.status(200).json(result);
});

// Get a club
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const clubDoc = await ClubModel.findById(id);
    if (!clubDoc) {
      res.sendStatus(404);
      return;
    }
    if (clubDoc.channelSource === 'discord') {
      const client = ReadingDiscordBot.getInstance();
      const guild = client.guilds.first();
      // Don't remove this line! This updates the Discord member objects internally, so we can access all users.
      await guild.fetchMembers();
      const guildMembers = await getChannelMembers(guild, clubDoc);
      const clubWithDiscord: Services.GetClubById = {
        ...clubDoc.toObject(),
        members: guildMembers,
        guildId: guild.id,
        createdAt:
          clubDoc.createdAt instanceof Date
            ? clubDoc.createdAt.toISOString()
            : clubDoc.createdAt,
        updatedAt:
          clubDoc.updatedAt instanceof Date
            ? clubDoc.updatedAt.toISOString()
            : clubDoc.updatedAt,
      };
      return res.status(200).send(clubWithDiscord);
    } else {
      return res
        .status(500)
        .send(`Error: unknown channelSource: ${clubDoc.channelSource}`);
    }
  } catch (err) {
    if (err.name) {
      switch (err.name) {
        case 'CastError':
          res.sendStatus(404);
          return;
        default:
          break;
      }
    }
    console.log(`Failed to get club ${id}`, err);
    return next(err);
  }
});

// Get a club's members
router.get('/members/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const clubDoc = await ClubModel.findById(id);
    if (!clubDoc) {
      res.sendStatus(404);
      return;
    }
    if (clubDoc.channelSource === 'discord') {
      const client = ReadingDiscordBot.getInstance();
      const guild = client.guilds.first();
      // Don't remove this line! This updates the Discord member objects internally, so we can access all users.
      await guild.fetchMembers();
      const guildMembers = await getChannelMembers(guild, clubDoc);
      return res.status(200).send(guildMembers);
    } else {
      return res
        .status(500)
        .send(`Error: unknown channelSource: ${clubDoc.channelSource}`);
    }
  } catch (err) {
    if (err.name) {
      switch (err.name) {
        case 'CastError':
          res.sendStatus(404);
          return;
        default:
          break;
      }
    }
    console.error(`Failed to get members for club ${id} `, err);
    return res.status(500).send(`Failed to get members for club ${id}`);
  }
});

// Return clubs from array of clubId's.
router.post(
  '/getClubsByIdWMembers',
  check('clubIds').isArray(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorArr = errors.array();
      return res.status(422).json({ errors: errorArr });
    }
    const { clubIds } = req.body;
    try {
      const clubs = await ClubModel.find({
        _id: {
          $in: clubIds,
        },
      });
      if (!clubs) {
        res.sendStatus(404);
        return;
      }
      const client = ReadingDiscordBot.getInstance();
      const guild = client.guilds.first();
      const guildMembersPromises: Promise<{
        club: ClubDoc;
        guildMembers: User[];
      }>[] = [];
      let guildErr: Error | null = null;
      // Don't remove this line! This updates the Discord member objects internally, so we can access all users.
      await guild.fetchMembers();
      clubs.forEach(c => {
        if (c.channelSource === 'discord') {
          guildMembersPromises.push(
            getChannelMembers(guild, c).then(r => {
              return { club: c, guildMembers: r };
            })
          );
        } else {
          guildErr = new Error(
            `Error: unknown channelSource: ${c.channelSource}`
          );
        }
      });
      if (guildErr) {
        res
          .status(500)
          // TODO: Check if it's appropriate to send errors like this.
          .send(guildErr);
        return;
      }

      const allGuildMembers = await Promise.all(guildMembersPromises);
      const clubsWithMemberObjs = allGuildMembers.map(gmObj => {
        if (gmObj.club.channelSource === 'discord') {
          return {
            ...gmObj.club.toObject(),
            members: gmObj.guildMembers,
            guildId: guild.id,
          };
        }
        // TODO: Add other channel sources
      });
      return res.status(200).send(clubsWithMemberObjs);
    } catch (err) {
      console.log('Failed to get clubs.', err);
      return next(err);
    }
  }
);

// Get clubs by Id but with member counts instead of members themselves
// Lightweight option for when you don't need all the member's information
router.post(
  '/getClubsByIdNoMembers',
  check('clubIds').isArray(),
  async (req, res) => {
    const { clubIds } = req.body;
    let clubs: ClubDoc[];
    try {
      clubs = await ClubModel.find({
        _id: {
          $in: clubIds,
        },
      })
        .sort({ createdAt: -1 })
        .exec();
      if (!clubs) {
        return res.sendStatus(404);
      }
    } catch (err) {
      console.error('Failed to save club data', err);
      return res.status(400).send('Failed to save club data');
    }
    const client = ReadingDiscordBot.getInstance();
    const guild = client.guilds.first();

    // Create a map of users found in the guild and attach the user doc
    const foundUsers = await getClubOwnerMap(guild, clubs);

    const filteredClubsWithMemberCounts: Services.GetClubs['clubs'] = clubs
      .map(clubDoc => {
        const discordChannel: GuildChannel | null = guild.channels.get(
          clubDoc.channelId
        );
        if (!discordChannel) {
          return null;
        }
        const foundUser = foundUsers.get(clubDoc.ownerId);
        const ownerName =
          getUsername(foundUser.userDoc, foundUser.member) || 'caravan-admin';
        const memberCount = getCountableMembersInChannel(
          discordChannel,
          clubDoc
        ).size;
        const club: Omit<Club, 'createdAt' | 'updatedAt'> & {
          createdAt: string;
          updatedAt: string;
        } = {
          ...clubDoc.toObject(),
          createdAt:
            clubDoc.createdAt instanceof Date
              ? clubDoc.createdAt.toISOString()
              : clubDoc.createdAt,
          updatedAt:
            clubDoc.updatedAt instanceof Date
              ? clubDoc.updatedAt.toISOString()
              : clubDoc.updatedAt,
        };
        const obj: Services.GetClubs['clubs'][0] = {
          ...club,
          ownerName,
          guildId: guild.id,
          memberCount,
        };
        return obj;
      })
      .filter(c => c !== null);
    const result: Services.GetClubs = {
      clubs: filteredClubsWithMemberCounts,
    };
    return res.status(200).json(result);
  }
);

interface CreateChannelInput {
  nsfw?: boolean;
  invitedUsers?: string[];
}

interface CreateClubBody
  extends CreateChannelInput,
    Omit<Club, 'ownerId' | 'channelId'> {}

// Create club
router.post('/', isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.session;
    const discordClient = ReadingDiscordBot.getInstance();
    const guild = discordClient.guilds.first();

    const body: CreateClubBody = req.body;
    const invitedUsers = body.invitedUsers || [];
    // Ensure exactly one instance of the owner is here
    invitedUsers.filter(u => u !== req.user.discordId);
    invitedUsers.push(req.user.discordId);
    const channelCreationOverwrites = invitedUsers.map(user => {
      const allowed: PermissionResolvable = [
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'READ_MESSAGES',
        'SEND_TTS_MESSAGES',
      ];
      if (user === req.user.discordId) {
        allowed.push('MANAGE_MESSAGES');
      }
      const overwrites: ChannelCreationOverwrites = {
        id: user,
        allow: allowed,
      };
      return overwrites;
    });

    // Make all channels unlisted (might have to handle Genre channels differently in the future)
    channelCreationOverwrites.push({
      id: guild.defaultRole.id,
      deny: ['VIEW_CHANNEL'],
    });

    const newChannel: ChannelData = {
      type: 'text',
      name: body.name,
      nsfw: body.nsfw || false,
      permissionOverwrites: channelCreationOverwrites,
      topic: body.bio,
    };
    const channel = (await guild.createChannel(
      newChannel.name,
      newChannel
    )) as TextChannel;

    const validShelf = getValidShelfFromNewShelf(
      body.newShelf || {
        current: [],
        notStarted: [],
        read: [],
      }
    );

    const clubModelBody: Omit<FilterAutoMongoKeys<Club>, 'members'> = {
      bio: body.bio,
      botSettings: body.botSettings,
      channelId: channel.id,
      channelSource: body.channelSource,
      genres: body.genres,
      maxMembers: body.maxMembers,
      name: body.name,
      newShelf: validShelf,
      ownerDiscordId: req.user.discordId,
      ownerId: userId,
      readingSpeed: body.readingSpeed,
      schedules: body.schedules,
      unlisted: body.unlisted,
      vibe: body.vibe,
    };

    const club = new ClubModel(clubModelBody);
    const newClub = await club.save();

    const channelTopic = getDefaultClubTopic(
      getClubUrl(newClub.id),
      club.bio || ''
    );
    channel.setTopic(channelTopic);

    createReferralAction(userId, 'createClub');

    const result: Services.CreateClubResult = {
      club: newClub.toObject(),
      discord: newChannel,
    };

    return res.status(201).send(result);
  } catch (err) {
    console.log('Failed to create new club', err);
    return next(err);
  }
});

const READING_SPEEDS: ReadingSpeed[] = ['slow', 'moderate', 'fast'];
const GROUP_VIBES: GroupVibe[] = [
  'chill',
  'first-timers',
  'learning',
  'nerdy',
  'power',
];

router.put('/joinMyReferralClubs', isAuthenticated, async (req, res) => {
  const { id: userId, discordId: userDiscordId } = req.user;
  if (!userId) {
    return res.status(400).send('req.user.userId must be set');
  }
  if (!userDiscordId) {
    return res.status(400).send('req.user.discordId must be set');
  }
  const referralDoc = await getReferralDoc(userId);
  if (
    !referralDoc ||
    referralDoc.referralDestination !== 'club' ||
    !referralDoc.referralDestinationId
  ) {
    res.status(404).send(`User ${userId} was not referred to any clubs`);
  }
  const { referralDestinationId: clubId } = referralDoc;
  const isMember = true;
  const { status, data } = await modifyClubMembership(
    userId,
    userDiscordId,
    clubId,
    isMember
  );
  res.status(status).send(data);
  return;
});

// Modify a club
router.put(
  '/:id',
  isAuthenticated,
  check('newClub.bio', 'Bio must be a string less than 300 chars in length.')
    .isString()
    .isLength({ max: 300 }),
  check(
    'newClub.botSettings',
    'Club must have bot settings specified.'
  ).exists(),
  check(
    'newClub.genres',
    'Genres must be an array of {key: string, name: string} elements'
  ).isArray(),
  oneOf(
    [
      check('newClub.maxMembers').isInt({ min: 2, max: 1000 }),
      check('newClub.maxMembers').isIn([UNLIMITED_CLUB_MEMBERS_VALUE]),
    ],
    `Max members must be an integer between 2 and 1000 inclusive, or ${UNLIMITED_CLUB_MEMBERS_VALUE}`
  ),
  check(
    'newClub.name',
    'Name must be a string between 2 and 150 chars in length'
  )
    .isString()
    .isLength({ min: 2, max: 150 }),
  check(
    'newClub.readingSpeed',
    `Reading speed must be one of ${READING_SPEEDS.join(', ')}`
  ).isIn(READING_SPEEDS),
  check(
    'newClub.schedules',
    'Schedules must be an array of ClubReadingSchedule objects!'
  ).isArray(),
  check('newClub.unlisted', 'Unlisted must be a boolean').isBoolean(),
  check('newClub.vibe', `Vibe must be one of ${GROUP_VIBES.join(', ')}`).isIn(
    GROUP_VIBES
  ),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorArr = errors.array();
      console.warn(
        `User {id: ${req.user._id}, name: ${
          req.user.name
        }} failed club update.\n${errorArr.toString()}\n${req.body}`
      );
      return res.status(422).json({ errors: errorArr });
    }
    const clubId = req.params.id;
    const newClub: Services.GetClubById = req.body.newClub;
    // TODO: The user can still cheat this. Need to first get the existing club by id and check against that.
    if (req.user.id !== newClub.ownerId) {
      console.warn(
        `User ${req.user._id} attempted to edit club ${clubId} without valid permission.`
      );
      return res.status(422).send('Only the club owner may update a club!');
    }
    if (
      newClub.maxMembers >= 0 &&
      newClub.maxMembers < newClub.members.length
    ) {
      console.warn(
        `User ${req.user._id} attempted to set max members on club ${clubId} to a value less than its current member count.`
      );
      res
        .status(422)
        .send(
          `You cannot set max members (${newClub.maxMembers}) to be smaller than the current number of members (${newClub.members.length}).`
        );
      return;
    }
    const updateObj: Pick<
      FilterAutoMongoKeys<Club>,
      | 'bio'
      | 'botSettings'
      | 'genres'
      | 'maxMembers'
      | 'name'
      | 'readingSpeed'
      | 'schedules'
      | 'unlisted'
      | 'vibe'
    > = {
      bio: newClub.bio,
      botSettings: newClub.botSettings,
      genres: newClub.genres,
      maxMembers: newClub.maxMembers,
      name: newClub.name,
      readingSpeed: newClub.readingSpeed,
      schedules: newClub.schedules,
      unlisted: newClub.unlisted,
      vibe: newClub.vibe,
    };
    let result: ClubDoc;
    try {
      const currentClub = await ClubModel.findById(clubId);
      if (!currentClub) {
        return res.status(400).send(`No club with ID: ${clubId}`);
      }
      if (currentClub.ownerId !== newClub.ownerId) {
        return res
          .status(401)
          .send('You do not have permission to modify this resource.');
      }
      result = await ClubModel.findByIdAndUpdate(clubId, updateObj, {
        new: true,
      });
      if (result) {
        return res.status(200).send(result);
      } else {
        console.warn(
          `User ${req.user._id} attempted to edit club ${clubId} but the club was not found.`
        );
        return res.status(404).send(`Unable to find club ${clubId}`);
      }
    } catch (err) {
      console.error('Failed to save club data', err);
      return res.status(400).send('Failed to save club data');
    }
  }
);

// Delete a club
router.delete('/:clubId', isAuthenticated, async (req, res) => {
  const { user } = req;
  const { clubId } = req.params;

  let clubDoc: ClubDoc;
  try {
    clubDoc = await ClubModel.findById(clubId);
  } catch (err) {
    return res.status(400).send(`Could not find club ${clubId}`);
  }

  const discordClient = ReadingDiscordBot.getInstance();
  const guild = discordClient.guilds.first();
  const channel: GuildChannel = guild.channels.get(clubDoc.channelId);
  if (!channel) {
    return res.status(400).send(`Channel was deleted, clubId: ${clubId}`);
  }

  const memberInChannel = (channel as VoiceChannel | TextChannel).members.get(
    user.discordId
  );
  if (memberInChannel && clubDoc.ownerId === user.id) {
    try {
      const deletedChannel = await channel.delete();
      console.log(
        `Deleted discord channel {${channel.id}, ${channel.name}} by user ${user.id}`
      );
      clubDoc = await clubDoc.remove();
      console.log(
        `Deleted club {${clubDoc.id},${clubDoc.name}} with channel {${channel.id}, ${channel.name}} by user ${user.id}`
      );
      return res.status(204).send(`Deleted channel ${deletedChannel.id}`);
    } catch (err) {
      console.log(
        `Failed to delete club {${clubDoc.id},${clubDoc.name}} with channel {${channel.id}, ${channel.name}} by user ${user.id}`
      );
      return res.status(500).send(err);
    }
  } else {
    console.log(
      `User ${user.id} failed to authenticate to delete club {${clubDoc.id},${clubDoc.name}} with channel {${channel.id}, ${channel.name}} by user ${user.id}`
    );
    return res
      .status(401)
      .send("You don't have permission to delete this channel.");
  }
});

router.put('/:id/shelf', isAuthenticated, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorArr = errors.array();
    return res.status(422).json({ errors: errorArr });
  }
  const { id: clubId } = req.params;
  // Using type assertion here, but we will sanitize with getValidShelfFromNewShelf.
  const newShelf = req.body.newShelf as ClubShelf;
  const validShelf = getValidShelfFromNewShelf(newShelf);
  let updatedClub: ClubDoc;
  try {
    updatedClub = await ClubModel.findByIdAndUpdate(
      clubId,
      {
        newShelf: validShelf,
      },
      { new: true }
    );
  } catch (err) {
    console.error(`Failed to update shelf for club ${clubId}: ${err}`);
    return res.status(400).send(`Failed to update shelf for club ${clubId}`);
  }
  if (!updatedClub) {
    console.error(`Could not find club ${clubId}`);
    return res.status(404).send(`Could not find club ${clubId}`);
  }
  return res.status(200).send(updatedClub);
});

// Modify current user's club membership
router.put(
  '/:clubId/membership',
  isAuthenticated,
  check('isMember').isBoolean(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const userId = req.user.id;
    const userDiscordId = req.user.discordId;
    const { clubId } = req.params;
    const { isMember } = req.body;
    const { status, data } = await modifyClubMembership(
      userId,
      userDiscordId,
      clubId,
      isMember
    );
    res.status(status).send(data);
    return;
  }
);

export default router;
