import { PubSub } from '@google-cloud/pubsub';

export const pubsubClient = (() => {
  let instance: PubSub;

  function createInstance() {
    if (process.env.NODE_ENV === 'production' && process.env.GAE_ENV) {
      // In a cloud environment, let the config be auto-handled by PubSub
      const client = new PubSub();
      return client;
    } else {
      // In a local environment, use a service account to access the appropriate PubSub stuff!
      // const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      // const client = new PubSub({
      //   keyFilename: keyFilename,
      // });
      const client = new PubSub();
      return client;
    }
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();
