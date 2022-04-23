// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'path';

import { pubsubClient } from './common/pubsub';
import {
  connect as connectToDb,
  disconnect as disconnectFromDb,
} from './db/config';
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import clubRoutes from './routes/clubRoutes';
import discordRoutes from './routes/discordRoutes';
import likeRoutes from './routes/likeRoutes';
import postRoutes from './routes/postRoutes';
import profileRoutes from './routes/profileRoutes';
import referralRoutes from './routes/referralRoutes';
import userPalettesRoutes from './routes/userPalettesRoutes';
import userRoutes from './routes/userRoutes';
import userSettingsRoutes from './routes/userSettingsRoutes';
import { ReadingDiscordBot } from './services/discord';

(async () => {
  const app = express();

  await connectToDb();

  // logs in
  ReadingDiscordBot.getInstance();
  pubsubClient.getInstance();

  const port = process.env['PORT'] || 3001;
  const env = process.env['NODE_ENV'] || 'development';
  console.log(`Running in ${env} environment`);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          imgSrc: ["'self'", 'data:', 'https://cdn.discordapp.com/'],
          scriptSrc: [
            "'self'",
            'https://cdn.discordapp.com/',
            'https://www.google-analytics.com/',
            'https://connect.facebook.net/',
          ],
        },
      },
      crossOriginResourcePolicy: {
        policy: 'cross-origin',
      },
    })
  );
  // TODO: more specific CORS
  app.use(cors());

  app.enable('trust proxy');
  if (process.env['NODE_ENV'] === 'production') {
    app.use(function (req, res, next) {
      const isHttps = req.secure;
      let host = req.header('host');
      const isWww = !!host.match(/^www\..*/i);
      let shouldRedirect = !isHttps;
      if (isWww) {
        host = host.replace('www.', '');
        shouldRedirect = true;
      }
      if (!shouldRedirect) {
        next();
      } else {
        if (req.method === 'GET') {
          res.redirect(301, `https://${host}${req.originalUrl}`);
        } else {
          res
            .status(403)
            .send(
              'Please use HTTPS and the naked domain (non-www) when submitting data to this server.'
            );
        }
      }
    });
  }
  app.use(cookieParser());
  app.use(
    cookieSession({
      name: 'session',
      keys: [process.env['COOKIE_SESSION_KEY']],
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })
  );
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

  app.use('/api/club', clubRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/books', bookRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/discord', discordRoutes);
  app.use('/api/referrals', referralRoutes);
  app.use('/api/userPalettes', userPalettesRoutes);
  app.use('/api/userSettings', userSettingsRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/likes', likeRoutes);

  if (env === 'production') {
    app.use(express.static(path.join(__dirname, '../../web/build')));

    // Only now, AFTER the above /api/ routes, the "catchall" handler routes: for any request that doesn't match any route after "/" below and send back React's index.html file.
    // Note, this 'catchall" route MUST be put after the above routes. Otherwise those api routes will never be hit.
    app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../web/build/index.html'));
    });
  }

  // app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  //   const { message } = err;
  //   switch (message) {
  //     case 'NoCodeProvided':
  //       return res.status(400).send({
  //         status: 'ERROR',
  //         error: message,
  //       });
  //     default:
  //       return res.status(500).send({
  //         status: 'ERROR',
  //         error: message,
  //       });
  //   }
  // });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });

  // Graceful shutdown, on sigint ( generated with <Ctrl>+C in the terminal ) - kill/close database connection and exit
  process.on('SIGINT', () => {
    disconnectFromDb();
    process.exit(0);
  });
})();
