import express from 'express';
import { getUserSettings, initSettings } from '../services/userSettings';

const router = express.Router();

// Get my user settings
router.get('/@me', async (req, res) => {
  const { userId } = req.session;
  try {
    const userSettings = await getUserSettings(userId);
    if (userSettings) {
      return res.status(200).send(userSettings);
    } else {
      console.log(`Initiating settings for user ${userId}`);
      const newSettings = await initSettings(userId);
      return res.status(200).send(newSettings);
    }
  } catch (err) {
    return res
      .status(500)
      .send(`Unable to fetch user settings for ${userId}: ${err}`);
  }
});

router.put('@me', async(req, res) => {
  const { settings } = req.body;
})

export default router;
