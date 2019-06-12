import axios from 'axios';
import express from 'express';
import {
  DiscordBase64Credentials,
  DiscordOAuth2Url,
  GetDiscordTokenCallbackUri,
} from '../auth/discord';
const router = express.Router();

router.get('/discord/login', (req, res) => {
  res.redirect(DiscordOAuth2Url);
});

router.get('/discord/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) throw new Error('NoCodeProvided');
  const tokenUri = GetDiscordTokenCallbackUri(code);

  try {
    const response = await axios.post(tokenUri, {
      headers: {
        Authorization: `Basic ${DiscordBase64Credentials}`,
      },
    });
    const json = await response.data();
    res.redirect(`/?token=${json.access_token}`);
  } catch (err) {
    console.error('Failed to get token from Discord', err);
    res.status(500).json({
      status: 'ERROR',
      error: err,
    });
  }
});

export default router;
