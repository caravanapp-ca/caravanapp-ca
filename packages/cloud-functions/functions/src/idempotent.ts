import { db } from './db';
import { firestore } from 'firebase-admin';
import { IdempotentSendData } from '..';

const leaseTime = 60 * 1000; // 60s

export function shouldSendWithLease(ref: firestore.DocumentReference) {
  return db.runTransaction(async transaction => {
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

export function markSent(ref: firestore.DocumentReference) {
  return ref.set({ sent: true });
}
