import express from 'express';
import { check, validationResult } from 'express-validator';
import { getReferralDoc, getAllReferralTiersDoc } from '../services/referral';
import generateUuid from 'uuid/v4';
import { ReferralSource } from '@caravan/buddy-reading-types';
import { handleFirstVisit, ALLOWED_UTM_SOURCES } from '../services/referral';
import { ReferralTierDoc, ReferralDoc } from '../../typings';

const router = express.Router();

router.get('/tiers', async (req, res, next) => {
  let referralTiersDoc: ReferralTierDoc[];
  try {
    referralTiersDoc = await getAllReferralTiersDoc();
  } catch (err) {
    return res.status(500).send('Failed to get referral tiers.');
  }
  return res.status(200).send(referralTiersDoc);
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  let referralDoc: ReferralDoc;
  try {
    referralDoc = await getReferralDoc(userId);
  } catch (err) {
    return res
      .status(400)
      .send(`Failed to get referral doc for user ${userId}`);
  }
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
      await handleFirstVisit(referredTempUid, referrerId, utmSource);
      req.session.referredTempUid = referredTempUid;
      return res.status(200).send();
    } catch (err) {
      console.error('Failed to save new referral object', err);
      return res.status(400).send('Failed to save new referral object');
    }
  }
);

export default router;
