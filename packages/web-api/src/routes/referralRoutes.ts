import express from 'express';
import { check, validationResult } from 'express-validator';
import generateUuid from 'uuid';
import { ReferralSource } from '@caravan/buddy-reading-types';
import { handleFirstVisit, ALLOWED_UTM_SOURCES } from '../services/referral';

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
