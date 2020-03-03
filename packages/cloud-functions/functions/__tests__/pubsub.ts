// import assert from 'assert';
// import path from 'path';
// import requestRetry from 'requestretry';
// import { PubSub } from '@caravanapp/buddy-reading-types';

// const execPromise = require('child-process-promise').exec;

// const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
// const cwd = path.join(__dirname, '..');

// const MESSAGE = 'Hello, world!';

// describe('functions/pubsub', () => {
//   let ffProc: Promise<any>;

//   beforeAll(() => {
//     ffProc = execPromise(
//       `functions-framework --target=publish --signature-type=http`,
//       { timeout: 1000, shell: true, cwd }
//     );
//   });

//   afterAll(async () => {
//     try {
//       await ffProc;
//     } catch (err) {
//       // Timeouts always cause errors on Linux, so catch them
//       if (err.name && err.name === 'ChildProcessError') {
//         return;
//       }

//       throw err;
//     }
//   });

//   it('publish fails without parameters', async () => {
//     const response = await requestRetry({
//       url: `${BASE_URL}/`,
//       method: 'POST',
//       body: {},
//       retryDelay: 200,
//       json: true,
//     });

//     const res: any = response;
//     assert.strictEqual(res.statusCode, 500);
//     assert.strictEqual(
//       res.body,
//       'Missing parameter(s); include "topic" and "subscription" properties in your request.'
//     );
//   });

//   it('publishes a message', async () => {
//     const topic: PubSub.Topic = 'club-membership';
//     const response = await requestRetry({
//       url: `${BASE_URL}/`,
//       method: 'POST',
//       body: {
//         topic,
//         message: 'Pub/Sub from Cloud Functions',
//       },
//       retryDelay: 200,
//       json: true,
//     });

//     const res: any = response;
//     assert.strictEqual(res.statusCode, 200);
//     assert.strictEqual(res.body, 'Message published.');
//   });

//   it('prints out a message', () => {
//     const jsonObject = JSON.stringify({ data: MESSAGE });
//     const jsonBuffer = Buffer.from(jsonObject).toString('base64');
//     const pubsubMessage = { data: jsonBuffer, attributes: {} };

//     require('../src/pubsub/onClubMembershipChange').onClubMembershipChanged(
//       pubsubMessage
//     );
//   });
// });
