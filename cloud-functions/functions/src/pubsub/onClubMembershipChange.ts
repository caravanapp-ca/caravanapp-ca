import { CloudFunctionsContext } from '@google-cloud/functions-framework';
import { PubSub as PubSubTypes } from '@caravanapp/types';
import { ReadingDiscordBot } from '../discord';
import { sendDiscordMessage } from '../discordMessenger';
import { getUser, getUserProfileUrl } from '../services/user';
import { getClub } from '../services/club';
import { connect } from '../db';
import { EventData } from '../..';

export const onJoinClub = async (
  context: Required<CloudFunctionsContext>,
  clubId: string,
  userId: string
) => {
  const { eventId } = context;
  const [userDoc, clubDoc] = await Promise.all([
    getUser(userId),
    getClub(clubId),
  ]);
  if (!userDoc) {
    throw new Error(`[eventId: ${eventId}] - Could not find user: ${userId}`);
  }
  if (!clubDoc) {
    throw new Error(`[eventId: ${eventId}] - Could not find club: ${clubId}`);
  }
  console.log(
    `[eventId: ${eventId}] - Fetched club ${clubId} and user ${userId}`
  );
  const { discordId, questions } = userDoc;
  const { channelId, botSettings } = clubDoc;
  if (botSettings.intros === false) {
    return undefined;
  }
  const client = ReadingDiscordBot.getInstance();
  const guild = client.guilds.first();
  if (!guild) {
    throw new Error(`[eventId: ${eventId}] - Could not find guild`);
  }
  const randomQuestion =
    questions[Math.floor(Math.random() * questions.length)];
  const channel = guild.channels.get(channelId);
  if (!channel) {
    throw new Error(
      `[eventId: ${eventId}] - Could not find discord channel: ${channelId}`
    );
  }
  const discordMessage = `<@${discordId}> just joined the club! When asked **"${
    randomQuestion.title
  }"**, they answered **"${
    randomQuestion.answer
  }"**. More info on their Caravan profile <${getUserProfileUrl(
    userDoc.urlSlug
  )}>`;
  if (channel.type === 'text') {
    return sendDiscordMessage(eventId, channel, discordMessage);
  }
  return undefined;
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

export const onClubMembershipChange = async (
  event: EventData,
  context: Required<CloudFunctionsContext>
) => {
  const { eventId } = context;
  const {
    clubId,
    clubMembership,
    userId,
  }: PubSubTypes.Message.ClubMembershipChange = JSON.parse(
    Buffer.from(event.data, 'base64').toString()
  );

  console.log(
    `[eventId: ${eventId}] - Attributes: { clubId: ${clubId}, clubMembership: ${clubMembership}, userId: ${userId} }`
  );
  const invalidAttributesMessage = `[eventId: ${eventId}] - Invalid attributes: { clubId: ${clubId}, clubMembership: ${clubMembership}, userId: ${userId} }`;
  if (clubId == null || clubMembership == null || userId == null) {
    console.error(invalidAttributesMessage);
    return;
  }

  const client = ReadingDiscordBot.getInstance();
  const onReadyPromise = new Promise<void>(resolve => {
    // If the client is already "ready", resolve.
    if (client.status === 0) {
      console.log(`Discord client already ready.`);
      resolve();
    } else {
      client.on('ready', () => {
        console.log(`Discord client ready.`);
        resolve();
      });
    }
  });
  await Promise.all([onReadyPromise, connect()]);

  switch (clubMembership) {
    case 'joined':
      await onJoinClub(context, clubId, userId);
      break;
    case 'left':
      // onLeaveClub(context, clubId, guildId, userDiscordId, userId);
      break;
    default:
      console.error(`Unknown club membership ${invalidAttributesMessage}`);
      break;
  }
};
