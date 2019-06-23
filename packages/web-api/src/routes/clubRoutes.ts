import express from 'express';
import {
  ChannelCreationOverwrites,
  ChannelData,
  Guild,
  GuildChannel,
  TextChannel,
  VoiceChannel,
  GuildMember,
} from 'discord.js';
import { check, validationResult } from 'express-validator/check';
import {
  Club,
  FilterAutoMongoKeys,
  ReadingState,
  Services,
  ShelfEntry,
} from '@caravan/buddy-reading-types';
import { Omit } from 'utility-types';
import ClubModel from '../models/club';
import UserModel from '../models/user';
import { isAuthenticated } from '../middleware/auth';
import { ReadingDiscordBot } from '../services/discord';
import { ClubDoc } from '../../typings/@caravan/buddy-reading-web-api';

const router = express.Router();

const isInChannel = (member: GuildMember, club: ClubDoc) =>
  !member.user.bot &&
  (member.highestRole.name !== 'Admin' || club.ownerDiscordId === member.id);

const getCountableMembersInChannel = (
  discordChannel: GuildChannel,
  club: ClubDoc
) =>
  (discordChannel as TextChannel | VoiceChannel).members.filter(m =>
    isInChannel(m, club)
  );

async function getChannelMembers(guild: Guild, club: ClubDoc) {
  let discordChannel = guild.channels.find(c => c.id === club.channelId);
  if (discordChannel.type !== 'text' && discordChannel.type !== 'voice') {
    return;
  }
  const guildMembersArr = getCountableMembersInChannel(
    discordChannel,
    club
  ).array();
  const guildMemberDiscordIds = guildMembersArr.map(m => m.id);
  const users = await UserModel.find({
    discordId: { $in: guildMemberDiscordIds },
    isBot: { $eq: false },
  });

  const guildMembers = guildMembersArr
    .map(mem => {
      const user = users.find(u => u.discordId === mem.id);
      if (user) {
        const result = {
          bio: user.bio,
          discordUsername: mem.user.username,
          discordId: mem.id,
          name: user.name,
          photoUrl:
            user.photoUrl ||
            mem.user.avatarURL ||
            mem.user.displayAvatarURL ||
            mem.user.defaultAvatarURL,
          readingSpeed: user.readingSpeed,
          userId: user.id,
        };
        return result;
      } else {
        // Handle case where a user comes into discord without creating an account
        // i.e. create a shadow account
        console.error('Create a shadow account');
        return null;
      }
    })
    .filter(g => g !== null);
  return guildMembers;
}

// TODO: Need to add checks here: Is the club full? Is the club private? => Don't return
// TODO: Paginate/feed-ify
router.get('/', async (req, res, next) => {
  const { after, pageSize, readingSpeed } = req.query;
  try {
    // Calculate number of documents to skip
    const query: any = {};
    if (after) {
      query._id = { $gt: after };
    }
    if (readingSpeed) {
      query.readingSpeed = { $eq: readingSpeed };
    }
    const size = Number.parseInt(pageSize || 0);
    const limit = Math.min(Math.max(size, 10), 25);
    const clubs = await ClubModel.find(query)
      .limit(limit)
      .exec();
    // Don't return full clubs
    // Don't return private clubs
    const client = ReadingDiscordBot.getInstance();
    const guild = client.guilds.first();
    const clubsWithMemberCounts: Services.GetClubs['clubs'] = clubs
      .map(club => {
        let discordChannel: GuildChannel | null = guild.channels.find(
          c => c.id === club.channelId
        );
        if (!discordChannel) {
          return null;
        }
        const memberCount = getCountableMembersInChannel(discordChannel, club)
          .size;
        const obj: Services.GetClubs['clubs'][0] = {
          ...club.toObject(),
          memberCount,
        };
        return obj;
      })
      .filter(c => c !== null);
    const result: Services.GetClubs = {
      clubs: clubsWithMemberCounts,
    };
    res.status(200).json(result);
  } catch (err) {
    console.error('Failed to get all clubs.', err);
    return next(err);
  }
});

// Get a club
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const club = await ClubModel.findById(id);
    if (!club) {
      res.status(404).send(null);
      return;
    }
    if (club.channelSource === 'discord') {
      const client = ReadingDiscordBot.getInstance();
      const guild = client.guilds.first();
      const guildMembers = await getChannelMembers(guild, club);

      const clubWithDiscord: Services.GetClubById = {
        _id: club.id,
        name: club.name,
        ownerId: club.ownerId,
        ownerDiscordId: club.ownerDiscordId,
        shelf: club.shelf,
        bio: club.bio,
        members: guildMembers,
        maxMembers: club.maxMembers,
        vibe: club.vibe,
        readingSpeed: club.readingSpeed,
        channelSource: club.channelSource,
        channelId: club.channelId,
        private: club.private,
        //TODO: Later
        createdAt: (club as any).createdAt,
        updatedAt: (club as any).updatedAt,
      };
      res.status(200).send(clubWithDiscord);
    } else {
      res
        .status(500)
        .send(`Error: unknown channelSource: ${club.channelSource}`);
      return;
    }
  } catch (err) {
    if (err.name) {
      switch (err.name) {
        case 'CastError':
          res.status(404).send(null);
          return;
        default:
          break;
      }
    }
    console.log(`Failed to get club ${id}`, err);
    return next(err);
  }
});

router.get('/my-clubs', isAuthenticated, async (req, res, next) => {
  const discordId = req.user.discordId;
  const client = ReadingDiscordBot.getInstance();
  const guild = client.guilds.first();

  const relevantChannels: GuildChannel[] = [];

  guild.channels.forEach(channel => {
    switch (channel.type) {
      case 'text':
        const textChannel = channel as TextChannel;
        if (textChannel.members.has(discordId)) {
          relevantChannels.push(textChannel);
        }
      case 'voice':
        const voiceChannel = channel as VoiceChannel;
        if (voiceChannel.members.has(discordId)) {
          relevantChannels.push(voiceChannel);
        }
      default:
        return;
    }
  });
  res.status(200).json(relevantChannels);
});

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
    const { userId, token } = req.session;
    const discordClient = ReadingDiscordBot.getInstance();
    const guild = discordClient.guilds.first();

    const body: CreateClubBody = req.body;
    const channelCreationOverwrites = (body.invitedUsers || []).map(user => {
      return {
        id: user,
        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGES'],
      } as ChannelCreationOverwrites;
    });

    // Make all channels private (might have to handle Genre channels differently in the future)
    channelCreationOverwrites.push({
      id: guild.defaultRole.id,
      deny: ['VIEW_CHANNEL'],
    });

    const newChannel: ChannelData = {
      type: 'text',
      name: body.name,
      nsfw: body.nsfw || false,
      userLimit: body.maxMembers,
      permissionOverwrites: channelCreationOverwrites,
    };
    const channel = (await guild.createChannel(
      newChannel.name,
      newChannel
    )) as TextChannel;

    guild.addMember(req.user.discordId, {
      accessToken: token,
    });

    const clubModelBody: Omit<FilterAutoMongoKeys<Club>, 'members'> = {
      name: body.name,
      bio: body.bio,
      maxMembers: body.maxMembers,
      readingSpeed: body.readingSpeed,
      shelf: body.shelf,
      ownerId: userId,
      ownerDiscordId: req.user.discordId,
      channelSource: body.channelSource,
      channelId: channel.id,
      private: body.private,
      vibe: body.vibe,
    };

    const club = new ClubModel(clubModelBody);
    const newClub = await club.save();

    const result: Services.CreateClubResult = {
      //@ts-ignore
      club: newClub,
      discord: newChannel,
    };

    res.status(201).send(result);
  } catch (err) {
    console.log('Failed to create new club', err);
    return next(err);
  }
});

// Modify a club
// router.put('/:id', isAuthenticated, async (req, res, next) => {
//   const editedClub = req.body;
//   try {
//     const doc = await ClubModel.findByIdAndUpdate(req.params.id, editedClub, {
//       new: true,
//     }).exec();
//     res.sendStatus(200);
//   } catch (err) {
//     console.log(`Failed to modify club ${req.params.id}`, err);
//     return next(err);
//   }
// });

// // Delete a club
// router.delete('/:id', isAuthenticated, async (req, res, next) => {
//   try {
//     const record = await ClubModel.remove({ _id: req.params.id });
//     res.sendStatus(204);
//   } catch (err) {
//     console.log(`Failed to delete club ${req.params.id}`, err);
//     return next(err);
//   }
// });

// Update a club's currently read book
router.put(
  '/:id/updatebook',
  isAuthenticated,
  check(['finishedPrev', 'newEntry']).isBoolean(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorArr = errors.array();
      return res.status(422).json({ errors: errorArr });
    }
    const clubId = req.params.id;
    const {
      newBook,
      newEntry,
      prevBookId,
      finishedPrev,
      addToWantToRead,
    } = req.body;
    let addToWantToReadArr = addToWantToRead as ShelfEntry[];
    const prevCondition = {
      _id: clubId,
      'shelf._id': prevBookId,
    };
    let newReadState: ReadingState = 'read';
    if (!finishedPrev) {
      newReadState = 'notStarted';
    }
    const prevUpdate = {
      $set: {
        'shelf.$.readingState': newReadState,
      },
    };
    let resultPrev;
    try {
      resultPrev = await ClubModel.findOneAndUpdate(prevCondition, prevUpdate, {
        new: true,
      });
    } catch (err) {
      return res.status(400).send(err);
    }
    let newCondition, newUpdate;
    if (!newEntry) {
      newCondition = {
        _id: clubId,
        'shelf._id': newBook._id,
      };
      const newReadingState: ReadingState = 'current';
      newUpdate = {
        $set: {
          'shelf.$.readingState': newReadingState,
          'shelf.$.updatedAt': new Date(),
        },
      };
    } else {
      newCondition = {
        _id: clubId,
      };
      newUpdate = {
        $addToSet: {
          shelf: {
            author: newBook.author,
            coverImageURL: newBook.coverImageURL,
            readingState: 'current',
            title: newBook.title,
            isbn: newBook.isbn,
            publishedDate: new Date(newBook.publishedDate),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      };
    }
    let resultNew;
    try {
      resultNew = await ClubModel.findOneAndUpdate(newCondition, newUpdate, {
        new: true,
      });
    } catch (err) {
      return res.status(400).send(err);
    }
    let resultAdd;
    if (addToWantToReadArr.length > 0) {
      const updateObject = addToWantToReadArr.map(b => ({
        author: b.author,
        coverImageURL: b.coverImageURL,
        readingState: 'notStarted',
        title: b.title,
        isbn: b.isbn,
        publishedDate: new Date(b.publishedDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      const addCondition = {
        _id: clubId,
      };
      const addUpdate = {
        $push: {
          shelf: {
            $each: updateObject,
          },
        },
      };
      try {
        resultAdd = await ClubModel.findOneAndUpdate(addCondition, addUpdate, {
          new: true,
        });
        if (resultPrev && resultNew && resultAdd) {
          return res.status(200).send({ resultAdd });
        }
      } catch (err) {
        return res.status(400).send(err);
      }
    }
    if (resultPrev && resultNew) {
      return res.status(200).send({ resultNew });
    }
  }
);

// Modify current user's club membership
router.put(
  '/:id/membership',
  isAuthenticated,
  check('isMember').isBoolean(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const userId = req.user._id;
    const userDiscordId = req.user.discordId;
    const clubId = req.params.id;
    const { isMember } = req.body;

    let club: ClubDoc;
    try {
      club = await ClubModel.findById(clubId);
    } catch (err) {
      res.status(400).send(`Could not find club ${clubId}`);
      return;
    }

    const discordClient = ReadingDiscordBot.getInstance();
    const guild = discordClient.guilds.first();
    const channel: GuildChannel = guild.channels.find(
      c => c.id === club.channelId
    );
    if (!channel) {
      res.status(400).send(`Channel was deleted, clubId: ${clubId}`);
      return;
    }

    if (isMember) {
      // Trying to add to members
      const memberInChannel = (channel as
        | VoiceChannel
        | TextChannel).members.find(m => m.id === userDiscordId);
      const { size } = getCountableMembersInChannel(channel, club);
      if (memberInChannel) {
        // already a member
        res.status(401).send("You're already a member of the club!");
        return;
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
        if (permissions && permissions.hasPermission('READ_MESSAGES')) {
          res.status(401).send('You already have access to the channel!');
          return;
        } else {
          (channel as VoiceChannel | TextChannel).overwritePermissions(
            userDiscordId,
            {
              READ_MESSAGES: true,
              SEND_MESSAGES: true,
            }
          );
          res.sendStatus(200);
          return;
        }
      }
    } else {
    }

    // try {
    //   if (isMember) {
    //     const condition = { _id: clubId, 'members.userId': { $ne: userId } };
    //     const update = {
    //       $addToSet: {
    //         members: {
    //           userId,
    //           role: 'member',
    //           createdAt: new Date(),
    //           updatedAt: new Date(),
    //         },
    //       },
    //     };
    //     const result = await ClubModel.findOneAndUpdate(condition, update, {
    //       new: true,
    //     });
    //     const userMembership = result.members.find(mem =>
    //       mem.userId.equals(userId)
    //     );
    //     res.status(200).json(userMembership);
    //   } else if (!isMember) {
    //     const update = {
    //       $pull: {
    //         members: {
    //           userId,
    //         },
    //       },
    //     };
    //     const result = await ClubModel.findByIdAndUpdate(clubId, update);
    //     res.sendStatus(200);
    //   }
    // } catch (err) {
    //   res.status(400).send(err);
    // }
  }
);

export default router;
