import { Client } from 'discord.js';
import * as functions from 'firebase-functions';
import { PubSub } from '@caravan/buddy-reading-types';
import { ReadingDiscordBot } from '../discord';
import { getUser, getUserProfileUrl } from '../services/user';
import { getClub } from '../services/club';
import { sendDiscordMessage } from '../discordMessager';

const callWhenReady = <T>(client: Client, cb: () => T) => {
  return new Promise<T>((resolve, reject) => {
    const main = () => {
      try {
        const result = cb();
        return resolve(result);
      } catch (err) {
        return reject(err);
      }
    };
    if (!client.readyTimestamp) {
      client.on('ready', () => {
        main();
      });
    } else {
      main();
    }
  });
};

const onJoinClub = async (
  context: functions.EventContext,
  clubId: string,
  guildId: string,
  _userDiscordId: string,
  userId: string
) => {
  const { eventId } = context;
  const client = ReadingDiscordBot.getInstance();
  const main = async () => {
    let guild = client.guilds.get(guildId);
    if (!guild) {
      throw new Error(
        `[eventId: ${eventId}] - Could not find guild: ${guildId}`
      );
    }
    const [, userDoc, clubDoc] = await Promise.all([
      guild.fetchMembers(),
      getUser(userId),
      getClub(clubId),
    ]);
    if (!userDoc) {
      throw new Error(`[eventId: ${eventId}] - Could not find user: ${userId}`);
    }
    if (!clubDoc) {
      throw new Error(`[eventId: ${eventId}] - Could not find club: ${clubId}`);
    }
    const { discordId, questions } = userDoc;
    const { channelId } = clubDoc;
    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];
    const channel = guild.channels.get(channelId);
    if (!channel) {
      throw new Error(
        `[eventId: ${eventId}] - Could not find discord channel: ${channelId}`
      );
    }
    const discordMessage = `<@${discordId}> just joined the club! When asked "${
      randomQuestion.title
    }", they answered "${
      randomQuestion.answer
    }". More info on their Caravan profile ${getUserProfileUrl(
      userDoc.urlSlug
    )}`;
    if (channel.type === 'text') {
      await sendDiscordMessage(eventId, channel, discordMessage);
    }
  };
  return await callWhenReady(client, main);
};

// const onLeaveClub = (
//   context: functions.EventContext,
//   clubId: string,
//   guildId: string,
//   userDiscordId: string,
//   userId: string
// ) => {
//   const { eventId } = context;
//   const client = ReadingDiscordBot.getInstance();
//   const guild = client.guilds.get(guildId);
//   if (!guild) {
//     throw new Error(`[eventId: ${eventId}] - Could not find guild: ${guildId}`);
//   }
//   guild.
//   return undefined;
// };

export const onClubMembershipChanged = functions.pubsub
  .topic(PubSub.Topic.CLUB_MEMBERSHIP)
  .onPublish(async (message, context) => {
    const { eventId } = context;
    const attributes = (message.attributes as unknown) as PubSub.Message.ClubMembershipChange;
    const {
      clubId,
      clubMembership,
      guildId,
      userDiscordId,
      userId,
    } = attributes;
    const invalidAttributesMessage = `[eventId: ${eventId}] - Invalid attributes: { clubId: ${clubId}, clubMembership: ${clubMembership}, guildId: ${guildId}, userDiscordId: ${userDiscordId}, userId: ${userId} }`;
    if (
      clubId == null ||
      clubMembership == null ||
      guildId == null ||
      userDiscordId == null ||
      userId == null
    ) {
      throw new Error(invalidAttributesMessage);
    }

    switch (clubMembership) {
      case 'joined':
        await onJoinClub(context, clubId, guildId, userDiscordId, userId);
        break;
      case 'left':
        // onLeaveClub(context, clubId, guildId, userDiscordId, userId);
        break;
      default:
        throw new Error(invalidAttributesMessage);
    }
  });
