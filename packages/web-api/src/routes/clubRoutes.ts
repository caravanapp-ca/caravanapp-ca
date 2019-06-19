import express from 'express';
import { TextChannel, VoiceChannel, GuildChannel } from 'discord.js';
import Club from '../models/club';
import { isAuthenticated } from '../middleware/auth';
import { ReadingDiscordBot } from '../services/discord';

const router = express.Router();

// Get a club
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const club = await Club.findById(id);
    if (club) {
      res.json(club);
    } else {
      res.status(404).send(null);
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

router.get('/', isAuthenticated, async (req, res, next) => {
  const discordId = req.user.discord.id;
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

// Create club
router.post('/', isAuthenticated, async (req, res, next) => {
  try {
    const club = new Club(req.body);
    const newClub = await club.save();
    res.status(201).json(newClub);
  } catch (err) {
    console.log('Failed to create new club', err);
    return next(err);
  }
});

// Modify a club
router.put('/:id', isAuthenticated, async (req, res, next) => {
  const editedClub = req.body;
  try {
    const doc = await Club.findByIdAndUpdate(req.params.id, editedClub, {
      new: true,
    }).exec();
    res.sendStatus(200);
  } catch (err) {
    console.log(`Failed to modify club ${req.params.id}`, err);
    return next(err);
  }
});

// Delete a club
router.delete('/:id', isAuthenticated, async (req, res, next) => {
  try {
    const record = await Club.remove({ _id: req.params.id });
    res.sendStatus(204);
  } catch (err) {
    console.log(`Failed to delete club ${req.params.id}`, err);
    return next(err);
  }
});

export default router;
