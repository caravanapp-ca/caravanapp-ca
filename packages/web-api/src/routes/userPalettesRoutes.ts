import express from 'express';

import { getUserPalettes } from '../services/userPalettes';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const userPalettes = await getUserPalettes(userId);
    return res.status(200).send({ userPalettes });
  } catch (err) {
    return res.status(400).send(`Unable to fetch user palettes for ${userId}`);
  }
});

export default router;
