require('dotenv').config();

import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import {
  connect as connectToDb,
  disconnect as disconnectFromDb,
} from './db/config';

import testRoutes from './routes/testRoutes';
import clubRoutes from './routes/clubRoutes';

(async () => {
  const app = express();

  // await connectToDb();

  const port = process.env.PORT || 3001;
  const env = process.env.NODE_ENV || 'development';
  console.log(`Running in ${env} environment`);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/api/test', testRoutes);
  // app.use('/api/club', clubRoutes);

  if (env === 'production') {
    app.use(express.static(path.join(__dirname, '../../web/build')));

    // Only now, AFTER the above /api/ routes, the "catchall" handler routes: for any request that doesn't match any route after "/" below and send back React's index.html file.
    // Note, this 'catchall" route MUST be put after the above two /api/ routes. Otherwise those api routes will never be hit
    app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../web/build/index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });

  // Graceful shutdown, on sigint ( generated with <Ctrl>+C in the terminal ) - kill/close database connection and exit
  process.on('SIGINT', () => {
    disconnectFromDb();
    process.exit(0);
  });
})();
