import express from 'express';
import { check, validationResult } from 'express-validator';
import { FilterAutoMongoKeys, Referral } from '@caravan/buddy-reading-types';
import { Omit } from 'utility-types';
import ReferralModel from '../models/referral';
import { generateUuid } from '../common/uuid';

const router = express.Router();

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
      const newReferralObject = await new ReferralModel(newReferral).save();
      req.session.referredTempUid = referredTempUid;
      return res.status(200).send(newReferralObject);
    } catch (err) {
      console.error('Failed to save new referral object', err);
      return res.status(400).send('Failed to save new referral object');
    }
  }
);

export default router;
