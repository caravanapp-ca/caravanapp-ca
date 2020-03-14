import { Message, MessageOptions, Channel, TextChannel } from 'discord.js';
import { Firestore } from '@caravanapp/types';
import { shouldSendWithLease, markSent } from './idempotent';
import { firestore } from './db';

export const sendDiscordMessage = async (
  eventId: string,
  channel: Channel,
  content?: string,
  options?: MessageOptions
) => {
  if (channel.type !== 'text' && channel.type !== 'dm') {
    console.error(
      `[eventId: ${eventId}] - Unexpected channel type: ${channel.type}.`
    );
    return undefined;
  }

  const collectionName: Firestore.CollectionName = 'discordBotMessages';
  const botMessageDocRef = firestore.collection(collectionName).doc(eventId);

  console.log(
    `[eventId: ${eventId}] - Checking if ${botMessageDocRef.path} is leased.`
  );
  const send = await shouldSendWithLease(botMessageDocRef);
  if (send) {
    console.log(`[eventId: ${eventId}] - Sending discord message.`);
    const discordMessage = (await (channel as TextChannel).send(
      content,
      options
    )) as Message;
    console.log(`[eventId: ${eventId}] - Sent discord message.`);
    const messageToSave: Partial<Message> = {
      createdAt: discordMessage.createdAt,
      content: discordMessage.content,
      id: discordMessage.id,
    };
    // Consider making this await
    const firestoreRef = markSent(botMessageDocRef, messageToSave);
    return {
      firestoreRef,
      discordMessage,
    };
  } else {
    console.log(
      `[eventId: ${eventId}] - Will not send discord message because the firestore doc is on lease.`
    );
    return undefined;
  }
};
