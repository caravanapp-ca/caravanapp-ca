import express from 'express';
import { getUserSettings } from '../services/userSettings';

const router = express.Router();

// Get my user settings
router.get('/@me', async (req, res) => {
  const { userId } = req.session;
  try {
    const userSettings = await getUserSettings(userId);
    if (userSettings) {
      return res.status(200).send(userSettings);
    } else {
      return res.status(401).send(`No user settings found for user ${userId}`);
    }
  } catch (err) {
    return res
      .status(500)
      .send(`Unable to fetch user settings for ${userId}: ${err}`);
  }
});

export default router;
