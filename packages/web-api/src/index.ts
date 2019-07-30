require('dotenv').config();

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import authRoutes from './routes/authRoutes';
import clubRoutes from './routes/clubRoutes';
import userRoutes from './routes/userRoutes';
import bookRoutes from './routes/bookRoutes';
import profileRoutes from './routes/profileRoutes';
import testRoutes from './routes/testRoutes';
import discordRoutes from './routes/discordRoutes';

import {
  connect as connectToDb,
  disconnect as disconnectFromDb,
} from './db/config';
import { ReadingDiscordBot } from './services/discord';

(async () => {
  const app = express();

  await connectToDb();

  const port = process.env.PORT || 3001;
  const env = process.env.NODE_ENV || 'development';
  console.log(`Running in ${env} environment`);

  // logs in
  const discordClient = ReadingDiscordBot.getInstance();

  app.use(helmet());
  app.enable('trust proxy');
  if (process.env.NODE_ENV === 'production') {
    app.use(function(req, res, next) {
      const isHttps = req.secure;
      if (isHttps) {
        next();
      } else {
        if (req.method === 'GET') {
          res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
        } else {
          res
            .status(403)
            .send('Please use HTTPS when submitting data to this server.');
        }
      }
    });
    app.use(function(req, res, next) {
      const host = req.header('host');
      if (host.match(/^www\..*/i)) {
        const nonWwwHost = host.replace('www.', '');
        res.redirect(301, `https://${nonWwwHost}${req.originalUrl}`);
      } else {
        next();
      }
    });
  }
  app.use(cookieParser());
  app.use(
    cookieSession({ name: 'session', keys: [process.env.COOKIE_SESSION_KEY] })
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/api/test', testRoutes);
  app.use('/api/club', clubRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/books', bookRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/discord', discordRoutes);

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
