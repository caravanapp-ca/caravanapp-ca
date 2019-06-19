import express, { Request, Response, NextFunction } from 'express';
import {
  FilterAutoMongoKeys,
  Session,
  UserDoc,
} from '@caravan/buddy-reading-types';
import { isAuthenticated } from '../middleware/auth';
import {
  DiscordOAuth2Url,
  DiscordUserResponseData,
  OAuth2TokenResponseData,
  ReadingDiscordBot,
} from '../services/discord';
import SessionModel from '../models/session';
import UserModel from '../models/user';

const router = express.Router();

export function destroySession(req: Request, res: Response) {
  req.session = null;
  res.cookie('userId', '');
}

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
  const model: FilterAutoMongoKeys<Session> = {
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
  const model: Pick<UserDoc, 'discord'> = {
    discord: data,
  };
  return model;
}

router.get('/logout', async (req, res) => {
  destroySession(req, res);
  res.redirect('/');
});

router.post('/discord/join', isAuthenticated, async (req, res, next) => {
  const { token } = req.session;
  const discordClient = ReadingDiscordBot.getInstance();
  const user = await ReadingDiscordBot.getMe(token);
  const guild = discordClient.guilds.first();
  const result = await guild.addMember(user.id, {
    accessToken: token,
  });
  return result;
});

router.get('/discord/callback', async (req, res) => {
  const { code, error, error_description, state } = req.query;
  if (error) {
    res.redirect(`/?error=${error}&error_description=${error_description}`);
    return;
  }
  let successfulAuthentication = true;
  let tokenResponseData = await ReadingDiscordBot.getToken(code);
  if (tokenResponseData.error) {
    const encodedErrorMessage = encodeURIComponent(
      tokenResponseData.error_description
    );
    destroySession(req, res);
    res.redirect(`/?error=${encodedErrorMessage}`);
    return;
  }
  let { access_token: accessToken } = tokenResponseData;
  const discordUserData = await ReadingDiscordBot.getMe(accessToken);

  let userDoc = await UserModel.findOne({
    'discord.id': discordUserData.id,
  });
  if (userDoc) {
    // Update the user, but lazy now.
  } else {
    const userInstance = convertUserResponseToModel(discordUserData);
    const userModel = new UserModel(userInstance);
    userDoc = await userModel.save();
  }

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
        tokenResponseData = await ReadingDiscordBot.refreshAccessToken(
          refreshToken
        );
        accessToken = tokenResponseData.access_token;
        const modelInstance = convertTokenResponseToModel(
          tokenResponseData,
          'discord',
          userDoc.id
        );
        currentSessionModel.update(modelInstance).exec();
      }
      // else validated
    } else {
      // New user, nice!
      const modelInstance = convertTokenResponseToModel(
        tokenResponseData,
        'discord',
        userDoc.id
      );
      const sessionModel = new SessionModel(modelInstance);
      const sessionSaveResult = sessionModel.save();
    }
  } catch (err) {
    // to check if it fails here
    const encodedErrorMessage = encodeURIComponent(err);
    destroySession(req, res);
    res.redirect(`/?error=${encodedErrorMessage}`);
    return;
  }

  if (successfulAuthentication) {
    req.session.token = accessToken;
    req.session.userId = userDoc.id;
    res.cookie('userId', userDoc.id);
    res.redirect(`/?state=${state}`);
  } else {
    destroySession(req, res);
    res.redirect(`/?error=Could+not+authenticate`);
  }
});

export default router;
