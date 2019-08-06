import * as functions from 'firebase-functions';
import { Firestore } from '@caravan/buddy-reading-types';
import { shouldSendWithLease, markSent } from './idempotent';
import { db } from './db';

export const sendDiscordMessage = async (
  eventId: string,
  event: functions.pubsub.Message
) => {
  const botMessageDocRef = db
    .collection(Firestore.Collection.DiscordBotMessages)
    .doc(eventId);

  const send = await shouldSendWithLease(botMessageDocRef);
  if (send) {
    // Send email.
    // sgMail.setApiKey(...);
    // sgMail.send({ ..., text: content.text });
    return markSent(botMessageDocRef);
  }
  // Do more here.
  return undefined;
};
