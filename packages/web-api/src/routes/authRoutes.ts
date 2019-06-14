import axios from 'axios';
import express from 'express';
import {
  DiscordApiUrl,
  DiscordBase64Credentials,
  DiscordOAuth2Url,
  GetDiscordTokenCallbackUri,
  GetDiscordTokenRefreshCallbackUri,
  DiscordUserResponseData,
  OAuth2TokenResponseData,
  DiscordClient,
} from '../services/discord';
import SessionModel from '../models/session';
import UserModel from '../models/user';
import {
  FilterAutoMongoKeys,
  SessionDoc,
  UserDoc,
} from '@caravan/buddy-reading-types';

const router = express.Router();

router.get('/discord/login', (req, res) => {
  const { state } = req.query;
  if (!state) {
    res.status(400).send('OAuth2 state required.');
    return;
  }
  res.redirect(DiscordOAuth2Url(state));
});

function convertTokenResponseToModel(
  obj: OAuth2TokenResponseData,
  client: string,
  userId: string
) {
  const model: FilterAutoMongoKeys<SessionDoc> = {
    accessToken: obj.access_token,
    accessTokenExpiresAt: Date.now() + obj.expires_in * 1000,
    refreshToken: obj.refresh_token,
    scope: obj.scope,
    tokenType: obj.token_type,
    client,
    userId,
  };
  return model;
}

function convertUserResponseToModel(data: DiscordUserResponseData) {
  const model: FilterAutoMongoKeys<UserDoc> = {
    discord: data,
  };
  return model;
}

router.get('/logout', async (req, res) => {
  req.session = null;
  res.cookie('token', '');
  res.redirect('/');
});

router.get('/discord/callback', async (req, res) => {
  const { code, error, error_description, state } = req.query;
  if (error) {
    res.redirect(`/?error=${error}&error_description=${error_description}`);
    return;
  }
  let successfulAuthentication = true;
  let tokenResponseData = await DiscordClient.getToken(code);
  if (tokenResponseData.error) {
    const encodedErrorMessage = encodeURIComponent(
      tokenResponseData.error_description
    );
    req.session = null;
    res.cookie('token', '');
    res.redirect(`/?error=${encodedErrorMessage}`);
    return;
  }
  let { access_token: accessToken } = tokenResponseData;
  const discordClient = new DiscordClient(accessToken);
  const discordUserData = await discordClient.getUser();

  try {
    const currentSessionModel = await SessionModel.findOne({ accessToken });
    if (currentSessionModel) {
      const accessTokenExpiresAt: number = currentSessionModel.get(
        'accessTokenExpiresAt'
      );
      const isExpired = Date.now() > accessTokenExpiresAt;
      if (isExpired) {
        // Begin token refresh
        const refreshToken: string = currentSessionModel.get('refreshToken');
        tokenResponseData = await DiscordClient.refreshAccessToken(
          refreshToken
        );
        accessToken = tokenResponseData.access_token;
        const modelInstance = convertTokenResponseToModel(
          tokenResponseData,
          'discord',
          discordUserData.id
        );
        currentSessionModel.update(modelInstance).exec();
      }
      // else validated
    } else {
      // New user, nice!
      const modelInstance = convertTokenResponseToModel(
        tokenResponseData,
        'discord',
        discordUserData.id
      );
      const sessionModel = new SessionModel(modelInstance);
      const sessionSaveResult = sessionModel.save();
    }
  } catch (err) {
    // to check if it fails here
    const encodedErrorMessage = encodeURIComponent(err);
    req.session = null;
    res.cookie('token', '');
    res.redirect(`/?error=${encodedErrorMessage}`);
    return;
  }

  let userDoc = await UserModel.findOne({ 'discord.id': discordUserData.id });
  if (userDoc) {
    // Update the user, but lazy now.
  } else {
    const userInstance = convertUserResponseToModel(discordUserData);
    const userModel = new UserModel(userInstance);
    userDoc = await userModel.save();
  }

  if (successfulAuthentication) {
    // Save the `access_token` to session with cookie-session
    res.cookie('token', accessToken);
    res.cookie('userId', userDoc.id);
    res.redirect(`/?state=${state}`);
  } else {
    req.session = null;
    res.cookie('token', '');
    res.redirect(`/?error=Could+not+authenticate`);
  }
});

export default router;
