import {} from 'discord.js';
import * as functions from 'firebase-functions';
import { PubSub } from '@caravan/buddy-reading-types';
import { ReadingDiscordBot } from '../discord';

const onJoinClub = (
  context: functions.EventContext,
  clubId: string,
  guildId: string,
  userDiscordId: string,
  userId: string
) => {
  const { eventId } = context;
  const client = ReadingDiscordBot.getInstance();
  let guild = client.guilds.get(guildId);
  if (!guild) {
    throw new Error(`[eventId: ${eventId}] - Could not find guild: ${guildId}`);
  }
};

const onLeaveClub = (
  context: functions.EventContext,
  clubId: string,
  guildId: string,
  userDiscordId: string,
  userId: string
) => {
  // const { eventId } = context;
  // const client = ReadingDiscordBot.getInstance();
  // const guild = client.guilds.get(guildId);
  // if (!guild) {
  //   throw new Error(`[eventId: ${eventId}] - Could not find guild: ${guildId}`);
  // }
  // guild.
  return undefined;
};

export const onClubMembershipChanged = functions.pubsub
  .topic(PubSub.Topic.CLUB_MEMBERSHIP)
  .onPublish((message, context) => {
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
        onJoinClub(context, clubId, guildId, userDiscordId, userId);
        break;
      case 'left':
        onLeaveClub(context, clubId, guildId, userDiscordId, userId);
        break;
      default:
        throw new Error(invalidAttributesMessage);
    }
  });
