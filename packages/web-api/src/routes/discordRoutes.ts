import type { TextChannel } from 'discord.js';
import express from 'express';
import { check, validationResult } from 'express-validator';

import { hasScope } from '../common/discordbot';
import { ReadingDiscordBot } from '../services/discord';
import { getSession } from '../services/session';

const router = express.Router();

router.post(
  '/channels/:channelId/messages',
  check('accessToken').isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorArr = errors.array();
      return res.status(422).json({ errors: errorArr });
    }
    const { channelId } = req.params;
    const accessToken: string = req.body.accessToken;
    const sessionDoc = await getSession(accessToken);
    if (!sessionDoc) {
      console.warn(`Failed attempt at posting message by user`);
      res.status(401).send('Unauthorized: unknown accessToken.');
      return;
    }
    if (sessionDoc.client !== 'discordBot') {
      console.warn(`Unauthorized client for sending discord bot message`);
      res
        .status(401)
        .send('Unauthorized: invalid client for provided access token.');
      return;
    }
    const isExpired = Date.now() > sessionDoc.accessTokenExpiresAt;
    if (isExpired) {
      console.warn(`Expired access token for sending discord bot message`);
      res.status(401).send('Unauthorized: expired access token.');
      return;
    }
    if (!hasScope(sessionDoc.scope, 'sendMessage')) {
      console.warn(`Unauthorized scope for sending discord bot message`);
      res.status(401).send('Unauthorized: do not have sendMessage scope.');
      return;
    }
    const client = ReadingDiscordBot.getInstance();
    const channel = client.channels.cache.find(
      c => c.id === channelId
    ) as TextChannel;

    const result = await channel.send({ content: req.body.content });
    console.log(`Sent discord bot message ${result.toString()}`);
    res.status(200).send(`Sent: ${result.toString()}`);
  }
);

router.post(
  '/members/:userToInviteDiscordId/messages',
  check('userToInviteDiscordId').isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorArr = errors.array();
      return res.status(422).json({ errors: errorArr });
    }
    const { messageContent } = req.body;
    const { userToInviteDiscordId } = req.params;
    const client = ReadingDiscordBot.getInstance();
    const member = await client.users.fetch(userToInviteDiscordId);
    const result = await member.send(messageContent);
    console.log(`Sent discord bot message ${result.toString()}`);
    res.status(200).send(`Sent: ${result.toString()}`);
  }
);

export default router;
