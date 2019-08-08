import { MessageOptions, Channel, TextChannel } from 'discord.js';
import { Firestore } from '@caravan/buddy-reading-types';
// import { shouldSendWithLease, markSent } from './idempotent';
import { firestore } from './db';

export const sendDiscordMessage = async (
  eventId: string,
  channel: Channel,
  content?: string,
  options?: MessageOptions
) => {
  if (channel.type !== 'text' && channel.type !== 'dm') {
    return undefined;
  }

  const collectionName: Firestore.CollectionName = 'discordBotMessages';
  /*const botMessageDocRef = */ firestore.collection(collectionName).doc(eventId);

  // const send = await shouldSendWithLease(botMessageDocRef);
  // if (send) {
  /*const discordMessage = */ await (channel as TextChannel).sendMessage(
    content,
    options
  );
  //   return {
  //     firestoreRef: markSent(botMessageDocRef),
  //     discordMessage,
  //   };
  // }
  // Do more here.
  return undefined;
};
