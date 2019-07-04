import express from 'express';
import { ReadingDiscordBot } from '../services/discord';
import { TextChannel } from 'discord.js';

const router = express.Router();

router.post('/channels/:channelId/messages', async (req, res) => {
  const { channelId } = req.params;
  const client = ReadingDiscordBot.getInstance();
  const channel = client.channels.find(c => c.id === channelId) as TextChannel;
  const result = await channel.send(req.body.content, req.body);
  res.status(200).send(`Sent: ${result.toString()}`);
});

export default router;
