import {
  ChannelCreationOverwrites,
  ChannelData,
  Guild,
  GuildChannel,
  TextChannel,
  VoiceChannel,
  GuildMember,
  PermissionResolvable
} from "discord.js";
import express from "express";
import { check, validationResult } from "express-validator";
import Fuse from "fuse.js";
import { Omit } from "utility-types";
import {
  Club,
  FilterAutoMongoKeys,
  ReadingState,
  Services,
  ShelfEntry,
  User,
  CurrBookAction,
  ReadingSpeed,
  GroupVibe,
  ActiveFilter,
  SameKeysAs
} from "@caravan/buddy-reading-types";
import {
  ClubDoc,
  ClubModel,
  UserDoc,
  UserModel
} from "@caravan/buddy-reading-mongo";
import { isAuthenticated } from "../middleware/auth";
import { shelfEntryWithHttpsBookUrl } from "../services/club";
import { ReadingDiscordBot } from "../services/discord";
import { getUser, mutateUserBadges, getUsername } from "../services/user";
import { createReferralAction } from "../services/referral";
import { getBadges } from "../services/badge";

const router = express.Router();

const isInChannel = (member: GuildMember, club: ClubDoc) =>
  (member.highestRole.name !== "Admin" || club.ownerDiscordId === member.id) &&
  !member.user.bot;

const getCountableMembersInChannel = (
  discordChannel: GuildChannel,
  club: ClubDoc
) =>
  (discordChannel as TextChannel | VoiceChannel).members.filter(m =>
    isInChannel(m, club)
  );

const getUserChannels = (
  guild: Guild,
  discordId: string,
  inChannels: boolean
) => {
  const channels = guild.channels.filter(c => {
    if (c.type === "text" || c.type === "voice") {
      const inThisChannel = !!(c as TextChannel).members.get(discordId);
      return inChannels === inThisChannel;
    } else {
      return false;
    }
  });
  return channels;
};

async function getChannelMembers(guild: Guild, club: ClubDoc) {
  const discordChannel = guild.channels.get(club.channelId);
  if (discordChannel.type !== "text" && discordChannel.type !== "voice") {
    return;
  }
  const guildMembers = getCountableMembersInChannel(
    discordChannel,
    club
  ).array();
  const guildMemberDiscordIds = guildMembers.map(m => m.id);
  const userDocs = await UserModel.find({
    discordId: { $in: guildMemberDiscordIds },
    isBot: { $eq: false }
  });
  // This retrieves badge details.
  const badgeDoc = await getBadges();
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
            mem.user.avatarURL ||
            mem.user.displayAvatarURL ||
            mem.user.defaultAvatarURL
        };
        return result;
      } else {
        // Handle case where a user comes into discord without creating an account
        // i.e. create a shadow account
        console.error("Create a shadow account");
        return null;
      }
    })
    .filter(g => g !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
  return users;
}

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

router.get("/", async (req, res) => {
  const { userId, after, pageSize, activeFilter, search } = req.query;
  const currUserId = req.session.userId;
  let currUser: UserDoc | undefined;
  if (currUserId) {
    currUser = await getUser(currUserId);
  }
  let user: UserDoc | undefined;
  if (userId) {
    user = await getUser(userId);
  }
  const query: SameKeysAs<Partial<Club>> = {};
  if ((!search || search.length === 0) && after) {
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
      filterObj.membership[0].key === "clubsImNotIn"
    ) {
      userInChannelBoolean = false;
    }
  }
  const client = ReadingDiscordBot.getInstance();
  const guild = client.guilds.first();
  if (userId) {
    const { discordId } = user;
    const channels = getUserChannels(guild, discordId, userInChannelBoolean);
    const channelIds = channels.map(c => c.id);
    query.channelId = { $in: channelIds };
  }
  // Calculate number of documents to skip
  const size = Number.parseInt(pageSize || 0);
  const limit = Math.min(Math.max(size, 10), 50);
  let clubDocs: ClubDoc[];
  try {
    // if (
    //   (search && search.length > 0) ||
    //   (filterObj && filterObj.capacity.length > 0)
    // ) {
    clubDocs = await ClubModel.find(query)
      .sort({ createdAt: -1 })
      .exec();
    // } else {
    //   clubs = await ClubModel.find(query)
    //     .limit(limit)
    //     .sort({ createdAt: -1 })
    //     .exec();
    // }
  } catch (err) {
    console.error("Failed to get all clubs, ", err);
    return res.status(500).send(`Failed to get all clubs: ${err}`);
  }
  if (!clubDocs) {
    return res.sendStatus(404);
  }

  // Create a map of users found in the guild and attach the user doc
  const foundUsers = await getClubOwnerMap(guild, clubDocs);

  let filteredClubsWithMemberCounts: Services.GetClubs["clubs"] = clubDocs
    .map(clubDoc => {
      const discordChannel: GuildChannel | null = guild.channels.get(
        clubDoc.channelId
      );
      const foundUser = foundUsers.get(clubDoc.ownerId);
      const ownerName =
        getUsername(foundUser.userDoc, foundUser.member) || "caravan-admin";
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
      const countableMembers = getCountableMembersInChannel(
        discordChannel,
        clubDoc
      );
      const memberCount = countableMembers.size;
      if (filterObj && filterObj.capacity.length > 0) {
        let capacityKeys = filterObj.capacity.map(c => c.key);
        if (
          capacityKeys.includes("spotsAvailable") &&
          memberCount >= clubDoc.maxMembers
        ) {
          return null;
        } else if (
          capacityKeys.includes("full") &&
          memberCount < clubDoc.maxMembers
        ) {
          return null;
        }
      }
      const club: Omit<Club, "createdAt" | "updatedAt"> & {
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
            : clubDoc.updatedAt
      };
      const obj: Services.GetClubs["clubs"][0] = {
        ...club,
        ownerName,
        guildId: guild.id,
        memberCount
      };
      return obj;
    })
    .filter(c => c !== null);
  if ((search && search.length) > 0) {
    const fuseOptions: Fuse.FuseOptions<Services.GetClubs["clubs"]> = {
      // TODO: Typescript doesn't like the use of keys here.
      // @ts-ignore
      keys: ["name", "shelf.title", "shelf.author"]
    };
    const fuse = new Fuse(filteredClubsWithMemberCounts, fuseOptions);
    filteredClubsWithMemberCounts = fuse.search(search);
  }
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
  if (filteredClubsWithMemberCounts.length > limit) {
    filteredClubsWithMemberCounts = filteredClubsWithMemberCounts.slice(
      0,
      limit
    );
  }
  const result: Services.GetClubs = {
    clubs: filteredClubsWithMemberCounts
  };
  return res.status(200).json(result);
});

// Get all of a user's clubs, with members attached.
// Quite heavyweight, use the route for without members above if you just need a member count
router.get("/wMembers/user/:userId", async (req, res) => {
  // Get query params.
  const { after, pageSize, activeFilter, search } = req.query;
  const { userId } = req.params;
  const currentUser = req.session.userId
    ? await UserModel.findById(req.session.userId)
    : null;
  let user: UserDoc | undefined;
  if (userId) {
    user = await getUser(userId);
  } else {
    return res.status(400).send("Require a valid user id to get user clubs");
  }
  // Apply necessary filters
  const query: SameKeysAs<Partial<Club>> = {
    channelSource: "discord"
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
      filterObj.membership[0].key === "clubsImNotIn"
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
  let filteredClubsWithMembersNulls: (Services.GetClubById | null)[] = await Promise.all(
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
          capacityKeys.includes("spotsAvailable") &&
          guildMembers.length >= clubDoc.maxMembers
        ) {
          return null;
        } else if (
          capacityKeys.includes("full") &&
          guildMembers.length < clubDoc.maxMembers
        ) {
          return null;
        }
      }
      return {
        ...clubDoc.toObject(),
        members: guildMembers,
        guildId: guild.id
      };
    })
  );
  let filteredClubsWithMembers: Services.GetClubById[] = filteredClubsWithMembersNulls.filter(
    c => c != null
  );
  if (search && search.length > 0) {
    const fuseOptions: Fuse.FuseOptions<Services.GetClubs["clubs"]> = {
      // TODO: Typescript doesn't like the use of keys here.
      // @ts-ignore
      keys: ["name", "shelf.title", "shelf.author"]
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
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const clubDoc = await ClubModel.findById(id);
    if (!clubDoc) {
      res.sendStatus(404);
      return;
    }
    if (clubDoc.channelSource === "discord") {
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
            : clubDoc.updatedAt
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
        case "CastError":
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
router.get("/members/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const clubDoc = await ClubModel.findById(id);
    if (!clubDoc) {
      res.sendStatus(404);
      return;
    }
    if (clubDoc.channelSource === "discord") {
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
        case "CastError":
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
  "/getClubsByIdWMembers",
  check("clubIds").isArray(),
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
          $in: clubIds
        }
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
        if (c.channelSource === "discord") {
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
        if (gmObj.club.channelSource === "discord") {
          return {
            ...gmObj.club.toObject(),
            members: gmObj.guildMembers,
            guildId: guild.id
          };
        }
        // TODO: Add other channel sources
      });
      return res.status(200).send(clubsWithMemberObjs);
    } catch (err) {
      console.log("Failed to get clubs.", err);
      return next(err);
    }
  }
);

// Get clubs by Id but with member counts instead of members themselves
// Lightweight option for when you don't need all the member's information
router.post(
  "/getClubsByIdNoMembers",
  check("clubIds").isArray(),
  async (req, res) => {
    const { clubIds } = req.body;
    let clubs: ClubDoc[];
    try {
      clubs = await ClubModel.find({
        _id: {
          $in: clubIds
        }
      })
        .sort({ createdAt: -1 })
        .exec();
      if (!clubs) {
        return res.sendStatus(404);
      }
    } catch (err) {
      console.error("Failed to save club data", err);
      return res.status(400).send("Failed to save club data");
    }
    const client = ReadingDiscordBot.getInstance();
    const guild = client.guilds.first();

    // Create a map of users found in the guild and attach the user doc
    const foundUsers = await getClubOwnerMap(guild, clubs);

    const filteredClubsWithMemberCounts: Services.GetClubs["clubs"] = clubs
      .map(clubDoc => {
        const discordChannel: GuildChannel | null = guild.channels.get(
          clubDoc.channelId
        );
        if (!discordChannel) {
          return null;
        }
        const foundUser = foundUsers.get(clubDoc.ownerId);
        const ownerName =
          getUsername(foundUser.userDoc, foundUser.member) || "caravan-admin";
        const memberCount = getCountableMembersInChannel(
          discordChannel,
          clubDoc
        ).size;
        const club: Omit<Club, "createdAt" | "updatedAt"> & {
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
              : clubDoc.updatedAt
        };
        const obj: Services.GetClubs["clubs"][0] = {
          ...club,
          ownerName,
          guildId: guild.id,
          memberCount
        };
        return obj;
      })
      .filter(c => c !== null);
    const result: Services.GetClubs = {
      clubs: filteredClubsWithMemberCounts
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
    Omit<Club, "ownerId" | "channelId"> {}

// Create club
router.post("/", isAuthenticated, async (req, res, next) => {
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
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "READ_MESSAGES",
        "SEND_TTS_MESSAGES"
      ];
      if (user === req.user.discordId) {
        allowed.push("MANAGE_MESSAGES");
      }
      const overwrites: ChannelCreationOverwrites = {
        id: user,
        allow: allowed
      };
      return overwrites;
    });

    // Make all channels unlisted (might have to handle Genre channels differently in the future)
    channelCreationOverwrites.push({
      id: guild.defaultRole.id,
      deny: ["VIEW_CHANNEL"]
    });

    const newChannel: ChannelData = {
      type: "text",
      name: body.name,
      nsfw: body.nsfw || false,
      userLimit: body.maxMembers,
      permissionOverwrites: channelCreationOverwrites
    };
    const channel = (await guild.createChannel(
      newChannel.name,
      newChannel
    )) as TextChannel;

    const shelf = body.shelf.map(shelfEntryWithHttpsBookUrl);

    const clubModelBody: Omit<FilterAutoMongoKeys<Club>, "members"> = {
      name: body.name,
      bio: body.bio,
      maxMembers: body.maxMembers,
      readingSpeed: body.readingSpeed,
      genres: body.genres,
      shelf,
      schedules: body.schedules,
      ownerId: userId,
      ownerDiscordId: req.user.discordId,
      channelSource: body.channelSource,
      channelId: channel.id,
      unlisted: body.unlisted,
      vibe: body.vibe
    };

    const club = new ClubModel(clubModelBody);
    const newClub = await club.save();

    createReferralAction(userId, "createClub");

    const result: Services.CreateClubResult = {
      //@ts-ignore
      club: newClub,
      discord: newChannel
    };

    return res.status(201).send(result);
  } catch (err) {
    console.log("Failed to create new club", err);
    return next(err);
  }
});

const READING_SPEEDS: ReadingSpeed[] = ["slow", "moderate", "fast"];
const GROUP_VIBES: GroupVibe[] = [
  "chill",
  "first-timers",
  "learning",
  "nerdy",
  "power"
];

// Modify a club
router.put(
  "/:id",
  isAuthenticated,
  check("newClub.bio", "Bio must be a string less than 300 chars in length.")
    .isString()
    .isLength({ max: 300 }),
  check(
    "newClub.genres",
    "Genres must be an array of {key: string, name: string} elements"
  ).isArray(),
  check(
    "newClub.maxMembers",
    "Max members must be an integer between 2 and 1000 inclusive"
  ).isInt({ gt: 1, lt: 1001 }),
  check(
    "newClub.name",
    "Name must be a string between 2 and 150 chars in length"
  )
    .isString()
    .isLength({ min: 2, max: 150 }),
  check(
    "newClub.readingSpeed",
    `Reading speed must be one of ${READING_SPEEDS.join(", ")}`
  ).isIn(READING_SPEEDS),
  check(
    "newClub.schedules",
    "Schedules must be an array of ClubReadingSchedule objects!"
  ).isArray(),
  check("newClub.unlisted", "Unlisted must be a boolean").isBoolean(),
  check("newClub.vibe", `Vibe must be one of ${GROUP_VIBES.join(", ")}`).isIn(
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
    if (req.user._id.toHexString() !== newClub.ownerId) {
      console.warn(
        `User ${
          req.user._id
        } attempted to edit club ${clubId} without valid permission.`
      );
      return res.status(422).send("Only the club owner may update a club!");
    }
    if (newClub.maxMembers < newClub.members.length) {
      console.warn(
        `User ${
          req.user._id
        } attempted to set max members on club ${clubId} to a value less than its current member count.`
      );
      res
        .status(422)
        .send(
          `You cannot set max members (${
            newClub.maxMembers
          }) to be smaller than the current number of members (${
            newClub.members.length
          }).`
        );
      return;
    }
    const updateObj: Pick<
      FilterAutoMongoKeys<Club>,
      | "bio"
      | "genres"
      | "maxMembers"
      | "name"
      | "readingSpeed"
      | "schedules"
      | "unlisted"
      | "vibe"
    > = {
      bio: newClub.bio,
      genres: newClub.genres,
      maxMembers: newClub.maxMembers,
      name: newClub.name,
      readingSpeed: newClub.readingSpeed,
      schedules: newClub.schedules,
      unlisted: newClub.unlisted,
      vibe: newClub.vibe
    };
    let result: ClubDoc;
    try {
      result = await ClubModel.findByIdAndUpdate(clubId, updateObj, {
        new: true
      });
      if (result) {
        return res.status(200).send(result);
      } else {
        console.warn(
          `User ${
            req.user._id
          } attempted to edit club ${clubId} but the club was not found.`
        );
        return res.status(404).send(`Unable to find club ${clubId}`);
      }
    } catch (err) {
      console.error("Failed to save club data", err);
      return res.status(400).send("Failed to save club data");
    }
  }
);

// Delete a club
router.delete("/:clubId", isAuthenticated, async (req, res) => {
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
        `Deleted discord channel {${channel.id}, ${channel.name}} by user ${
          user.id
        }`
      );
      clubDoc = await clubDoc.remove();
      console.log(
        `Deleted club {${clubDoc.id},${clubDoc.name}} with channel {${
          channel.id
        }, ${channel.name}} by user ${user.id}`
      );
      return res.status(204).send(`Deleted channel ${deletedChannel.id}`);
    } catch (err) {
      console.log(
        `Failed to delete club {${clubDoc.id},${clubDoc.name}} with channel {${
          channel.id
        }, ${channel.name}} by user ${user.id}`
      );
      return res.status(500).send(err);
    }
  } else {
    console.log(
      `User ${user.id} failed to authenticate to delete club {${clubDoc.id},${
        clubDoc.name
      }} with channel {${channel.id}, ${channel.name}} by user ${user.id}`
    );
    return res
      .status(401)
      .send("You don't have permission to delete this channel.");
  }
});

// Update a club's currently read book
router.put(
  "/:id/updatebook",
  isAuthenticated,
  check("newEntry").isBoolean(),
  check("prevBookId").isString(),
  check("currBookAction").isString(),
  check("wantToRead").isArray(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorArr = errors.array();
      return res.status(422).json({ errors: errorArr });
    }
    const clubId = req.params.id as string;
    const {
      newBook,
      newEntry,
      prevBookId,
      currBookAction,
      wantToRead
    } = req.body;
    let wantToReadArr = wantToRead as FilterAutoMongoKeys<ShelfEntry>[];
    const shelfEntry = shelfEntryWithHttpsBookUrl(newBook);
    let resultNew;
    if (currBookAction !== "current") {
      if (prevBookId) {
        switch (currBookAction as CurrBookAction) {
          case "delete":
            await ClubModel.updateOne(
              { _id: clubId },
              { $pull: { shelf: { _id: prevBookId } } }
            );
            break;
          case "notStarted":
          case "read":
            const prevCondition = {
              _id: clubId,
              "shelf._id": prevBookId
            };
            const prevUpdate = {
              "shelf.$.readingState": currBookAction,
              "shelf.$.updatedAt": new Date()
            };
            try {
              await ClubModel.findOneAndUpdate(prevCondition, prevUpdate, {
                new: true
              });
            } catch (err) {
              return res.status(400).send(err);
            }
            break;
          default:
            return res
              .status(400)
              .send("Invalid value passed for currBookAction!");
        }
      }
      let newCondition, newUpdate;
      const newReadingState: ReadingState = "current";
      if (!newEntry) {
        newCondition = {
          _id: clubId,
          "shelf._id": shelfEntry._id
        };
        newUpdate = {
          $set: {
            "shelf.$.readingState": newReadingState,
            "shelf.$.updatedAt": new Date()
          }
        };
      } else {
        newCondition = {
          _id: clubId
        };
        newUpdate = {
          $addToSet: {
            shelf: {
              ...shelfEntry,
              readingState: newReadingState,
              publishedDate: shelfEntry.publishedDate
                ? new Date(shelfEntry.publishedDate)
                : undefined,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        };
      }
      try {
        resultNew = await ClubModel.findOneAndUpdate(newCondition, newUpdate, {
          new: true
        });
      } catch (err) {
        return res.status(400).send(err);
      }
    }
    const wtrReadingState: ReadingState = "notStarted";
    const updateObject = wantToReadArr.map(b => {
      return {
        ...b,
        readingState: wtrReadingState,
        publishedDate: b.publishedDate ? new Date(b.publishedDate) : undefined,
        updatedAt: new Date()
      };
    });
    const wtrCondition = {
      _id: clubId
    };
    const wtrUpdate = {
      $push: { shelf: { $each: updateObject } }
    };
    let resultWTR;
    try {
      await ClubModel.update(
        { _id: clubId },
        {
          $pull: {
            shelf: { readingState: "notStarted", _id: { $ne: prevBookId } }
          }
        }
      );
      resultWTR = await ClubModel.findOneAndUpdate(wtrCondition, wtrUpdate, {
        new: true
      });
    } catch (err) {
      return res.status(400).send(err);
    }
    if (resultWTR) {
      return res.status(200).send({ resultWTR });
    } else if (resultNew) {
      return res.status(200).send({ resultNew });
    }
    return res.sendStatus(400);
  }
);

// Modify current user's club membership
router.put(
  "/:clubId/membership",
  isAuthenticated,
  check("isMember").isBoolean(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const userId = req.user.id;
    const userDiscordId = req.user.discordId;
    const { clubId } = req.params;
    const { isMember } = req.body;
    let club: ClubDoc;
    try {
      club = await ClubModel.findById(clubId);
    } catch (err) {
      return res.status(400).send(`Could not find club ${clubId}`);
    }
    const isOwner = club.ownerId === userId;
    const discordClient = ReadingDiscordBot.getInstance();
    const guild = discordClient.guilds.first();
    const channel: GuildChannel = guild.channels.get(club.channelId);
    if (!channel) {
      return res.status(400).send(`Channel was deleted, clubId: ${clubId}`);
    }
    const memberInChannel = (channel as VoiceChannel | TextChannel).members.get(
      userDiscordId
    );
    if (isMember) {
      // Trying to add to members
      const { size } = getCountableMembersInChannel(channel, club);
      if (memberInChannel) {
        // already a member
        return res.status(401).send("You're already a member of the club!");
      } else if (size >= club.maxMembers) {
        res
          .status(401)
          .send(
            `There are already ${size}/${club.maxMembers} people in the club.`
          );
        return;
      } else {
        const permissions = (channel as
          | VoiceChannel
          | TextChannel).memberPermissions(memberInChannel);
        if (permissions && permissions.hasPermission("READ_MESSAGES")) {
          return res
            .status(401)
            .send("You already have access to the channel!");
        }
        await (channel as VoiceChannel | TextChannel).overwritePermissions(
          userDiscordId,
          {
            READ_MESSAGES: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: true,
            MANAGE_MESSAGES: isOwner
          }
        );
        createReferralAction(userId, "joinClub");
      }
    } else {
      if (isOwner) {
        return res.status(401).send("An owner cannot leave a club.");
      }
      if (!memberInChannel) {
        return res.status(401).send("You're not a member of the club already!");
      }
      await (channel as VoiceChannel | TextChannel).overwritePermissions(
        userDiscordId,
        {
          READ_MESSAGES: false,
          SEND_MESSAGES: false,
          SEND_TTS_MESSAGES: false,
          MANAGE_MESSAGES: false
        }
      );
    }
    // Don't remove this line! This updates the Discord member objects internally, so we can access all users.
    await guild.fetchMembers();
    const members = await getChannelMembers(guild, club);
    return res.status(200).send(members);
  }
);

export default router;
