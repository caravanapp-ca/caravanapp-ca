import { DocumentReference, DocumentData } from '@google-cloud/firestore';
import { firestore } from './db';
import { IdempotentSendData } from '..';

const leaseTime = 60 * 1000; // 60s

export function shouldSendWithLease(ref: DocumentReference) {
  return firestore.runTransaction(async transaction => {
    const doc = await transaction.get(ref);
    const data = doc.data() as IdempotentSendData | undefined;
    if (data) {
      if (doc.exists && data.sent) {
        return false;
      }
      if (doc.exists && new Date() < data.lease) {
        throw new Error('Lease already taken, try later.');
      }
    }
    transaction.set(ref, {
      lease: new Date(new Date().getTime() + leaseTime),
    });
    return true;
  });
}

export function markSent(ref: DocumentReference, extraData?: DocumentData) {
  const data: DocumentData = {
    sent: true,
    ...(extraData || {}),
  };
  return ref.set(data);
}
