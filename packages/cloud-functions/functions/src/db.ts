import { Firestore } from '@google-cloud/firestore';
import mongoose, { ConnectionOptions } from 'mongoose';

const firestore = new Firestore();

const dbConnectionString = process.env.MONGO_DB;
const options: ConnectionOptions = {
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 1000,
  poolSize: 10, // Maintain up to 10 socket connections
  useNewUrlParser: true,
};

export function connect() {
  if (dbConnectionString) {
    return mongoose.connect(dbConnectionString, options);
  }
  throw new Error('Undefined connection string');
}

export function disconnect() {
  return mongoose.disconnect();
}

mongoose.connection.on('open', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', () => {
  console.log('Error in MongoDB connections');
});

// on mongo connection disconnected event
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

//listen for SIGINT event(generated with <Ctrl>+C in the terminal) and close db connection on that event
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});

export { firestore };
