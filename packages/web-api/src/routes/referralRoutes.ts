import express from 'express';
import { check, validationResult } from 'express-validator';
import { FilterAutoMongoKeys, Referral } from '@caravan/buddy-reading-types';
import { Omit } from 'utility-types';
import ReferralModel from '../models/referral';
import { generateUuid } from '../common/uuid';
import { getReferralDoc, getAllReferralTiersDoc } from '../services/referral';

const router = express.Router();

router.get('/tiers', async (req, res, next) => {
  const referralTierDoc = await getAllReferralTiersDoc();
});

router.get('/:userId', async (req, res, next) => {
  const { userId } = req.params;
  const referralDoc = await getReferralDoc(userId);
  if (!referralDoc) {
    return res
      .status(404)
      .send(`Could not find referral doc for user ${userId}`);
  }
  return res.status(200).send(referralDoc);
});

router.post(
  '/handleReferralClick/:referrerId',
  check('referrerId').isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorArr = errors.array();
      return res.status(422).json({ errors: errorArr });
    }
    const { referrerId } = req.params;
    const referredTempUid = generateUuid();
    const newReferral: Omit<
      FilterAutoMongoKeys<Referral>,
      'referredUsers' | 'referralCount' | 'source'
    > = {
      userId: referredTempUid,
      referredById: referrerId,
      actions: [
        {
          action: 'click',
          timestamp: new Date(),
        },
      ],
      referredAndNotJoined: true,
    };
    try {
      const newReferralDoc = await new ReferralModel(newReferral).save();
      console.log(
        `[Referral] UserId: ${newReferralDoc.userId}, Referrer: ${newReferralDoc.referredById}, Action: click`
      );
      req.session.referredTempUid = referredTempUid;
      return res.status(200).send();
    } catch (err) {
      console.error('Failed to save new referral object', err);
      return res.status(400).send('Failed to save new referral object');
    }
  }
);

export default router;
