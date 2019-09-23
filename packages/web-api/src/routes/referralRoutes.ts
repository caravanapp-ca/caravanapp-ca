import express from 'express';
import { check, validationResult } from 'express-validator';
import generateUuid from 'uuid/v4';
import {
  ReferralSource,
  ReferralDestination,
} from '@caravan/buddy-reading-types';
import {
  ALLOWED_UTM_SOURCES,
  getReferralDoc,
  handleFirstVisit,
  ALLOWED_REFERRAL_DESTINATIONS,
} from '../services/referral';
import { Types } from 'mongoose';

const router = express.Router();

// Currently unused, potentially useful if we show tiers on the front-end
// router.get('/tiers', async (req, res, next) => {
//   let referralTiersDoc: ReferralTierDoc;
//   try {
//     referralTiersDoc = await getReferralTiersDoc();
//   } catch (err) {
//     return res.status(400).send('Failed to get referral tiers.');
//   }
//   return res.status(200).send(referralTiersDoc);
// });

router.get('/count/:userId', async (req, res) => {
  const { userId } = req.params;
  const referralDoc = await getReferralDoc(userId);
  const referralCount = referralDoc ? referralDoc.referralCount : 0;
  return res.status(200).send({ referralCount });
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
    const referralDestinationIdStr = req.body.referralDestinationId;
    if (
      referralDestinationIdStr &&
      typeof referralDestinationIdStr !== 'string'
    ) {
      res.status(400).send('referralDestinationId must be a string');
    }
    if (
      referralDestinationIdStr &&
      !Types.ObjectId.isValid(referralDestinationIdStr)
    ) {
      res
        .status(400)
        .send(
          `referralDestinationId ${referralDestinationIdStr} is not a valid Object ID.`
        );
    }
    // Ugly way of forcing to null, consider cleaning up
    let referralDestination: ReferralDestination = req.body.referralDestination
      ? req.body.referralDestination
      : null;
    let referralDestinationId: Types.ObjectId = referralDestinationIdStr
      ? new Types.ObjectId(referralDestinationIdStr)
      : null;
    referralDestination =
      referralDestination == null ||
      ALLOWED_REFERRAL_DESTINATIONS[referralDestination] === true
        ? referralDestination
        : null;
    // Ugly way of forcing to null, consider cleaning up
    let utmSource: ReferralSource = req.body.utmSource
      ? req.body.utmSource
      : null;
    utmSource =
      utmSource == null || ALLOWED_UTM_SOURCES[utmSource] === true
        ? utmSource
        : null;
    const referredTempUid = generateUuid();
    try {
      await handleFirstVisit(
        referredTempUid,
        referrerId,
        referralDestination,
        referralDestinationId,
        utmSource
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
