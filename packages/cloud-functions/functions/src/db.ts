import { Firestore } from '@google-cloud/firestore';
import mongoose, { ConnectionOptions } from 'mongoose';

const firestore = new Firestore();

const dbConnectionString = process.env.MONGO_DB;
/**
 * These connection options are subject to tuning.
 * A *reconnectTries* of 10 is below the default of 30 since it's unlikely to get in that situation regardless.
 * A *reconnectInterval* of 1s is fine since it takes <100ms to connect.
 * A *poolSize* of 1 is subject to debate. From on the SQL documentation for cloud functions:
 * **Connection Pools & Connection Loss**
 * Connections to underlying databases may be dropped, either by the database server itself, or by the infrastructure
 * underlying Cloud Functions. To mitigate this, we recommend that you use a client library that supports connection
 * pools that automatically reconnect broken client connections.
 *
 * When using a connection pool, it is important to set the maximum connections to 1. This may seem counter-intuitive,
 * however, creating more than one concurrent connection per function instance may cause rapid exhaustion of connection
 * resources (see Maximum Concurrent Connections below for more detail). Cloud Functions limits concurrent executions
 * to 1 per instance. This means you will never have a situation where two requests are being processed by a single
 * function instance at the same time, so in most situations only a single database connection is needed.
 *
 * **Connection Reuse**
 * Where possible, we recommend that you allocate connection objects in global scope. This is both a performance
 * optimization, and a less error-prone approach as it is often the case that connection closure is missed
 * (for example, when unexpected errors occur).
 *
 * If you use a connection pool in global scope, then we recommend that you not close connections at the end of the
 * function call. If you do not use a pool in global scope, and/or if you create individual connections in
 * function-scope, then you should close these connections before the function returns.
 *
 * Using a globally scoped connection pool is recommended as this will improve the likelihood that the same connection
 * is reused for subsequent invocations of the function, and the connection will be closed naturally when the function
 * instance is evicted (auto-scaled down).
 * @see https://cloud.google.com/functions/docs/sql#maximum_concurrent_connections
 */
const options: ConnectionOptions = {
  reconnectTries: 10,
  reconnectInterval: 1000,
  poolSize: 1,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

export async function connect() {
  if (!dbConnectionString) {
    throw new Error('Undefined connection string');
  }
  /*
   * Connection ready state
   * 0 = disconnected
   * 1 = connected
   * 2 = connecting
   * 3 = disconnecting
   */
  if (
    mongoose.connection.readyState === 1 ||
    mongoose.connection.readyState === 2
  ) {
    console.log(`Reusing connection to MongoDB.`);
  } else {
    await mongoose.connect(dbConnectionString, options);
  }
  return mongoose;
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

export { firestore };
