import express from 'express';
import { TextChannel } from 'discord.js';
import { check } from 'express-validator';
import { isAuthenticated } from '../middleware/auth';
import SessionModel from '../models/session';
import { ReadingDiscordBot } from '../services/discord';

const router = express.Router();

router.post(
  '/channels/:channelId/messages',
  isAuthenticated,
  check('accessToken').isString(),
  async (req, res) => {
    const { channelId } = req.params;
    const { accessToken } = req.body;
    const sessionDoc = await SessionModel.findOne({ accessToken });
    if (!sessionDoc) {
      console.warn(
        `Failed attempt at posting message by user {id: ${req.user.id}, name: ${req.user.name}}`
      );
      res.status(401).send('Unauthorized: unknown accessToken.');
      return;
    }
    if (sessionDoc.client !== 'discordBot') {
      console.warn(
        `Unauthorized client for posting message by user {id: ${req.user.id}, name: ${req.user.name}}`
      );
      res
        .status(401)
        .send('Unauthorized: invalid client for provided access token.');
      return;
    }
    const isExpired = Date.now() > sessionDoc.accessTokenExpiresAt;
    if (isExpired) {
      console.warn(
        `Expired access token for posting discord bot message by user {id: ${req.user.id}, name: ${req.user.name}}`
      );
      res.status(401).send('Unauthorized: expired access token.');
      return;
    }
    const client = ReadingDiscordBot.getInstance();
    const channel = client.channels.find(
      c => c.id === channelId
    ) as TextChannel;

    const result = await channel.send(req.body.content, req.body);
    console.log(
      `Sent discord bot message by user {id: ${req.user.id}, name: ${
        req.user.name
      }}: ${result.toString()}`
    );
    res.status(200).send(`Sent: ${result.toString()}`);
  }
);

export default router;
