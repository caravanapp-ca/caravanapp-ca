import express from 'express';
import { getUserSettings, initSettings, updateUserSettings } from '../services/userSettings';

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

// Update my user settings
router.put('@me', async(req, res) => {
  const { userId } = req.session;
  const { settings } = req.body;
  try{
    const newUserSettings = await updateUserSettings(userId, settings);
    if(newUserSettings){
      return res.status(200).send(newUserSettings);
    } else {
      return res.status(404).send(`Didn't find existing user settings for user ${userId}`);
    }
  } catch (err) {
    console.error(`Failed to update user settings for ${userId}: ${err}`)
    return res.status(400).send(`Failed to update user settings for ${userId}: ${err}`);
  }
});

export default router;
