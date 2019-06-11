import mongoose, { ConnectionOptions } from 'mongoose';

export const dbConnectionString = process.env.MONGO_DB;
export const options: ConnectionOptions = {
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 1000,
  poolSize: 10, // Maintain up to 10 socket connections
  useNewUrlParser: true,
};

export function connect() {
  return mongoose.connect(dbConnectionString, options);
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
