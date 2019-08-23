/**
 * ADMIN ACCOUNT REQUIRED.
 * Connection count by client IP, with total
 * View the number of connections by IPAddress with a total connection count.
 * This is intended to be used to see connection reuse within cloud functions.
 */
db.currentOp(true).inprog.reduce(
  (accumulator, connection) => {
    ipaddress = connection.client
      ? connection.client.split(':')[0]
      : 'Internal';
    accumulator[ipaddress] = (accumulator[ipaddress] || 0) + 1;
    accumulator['TOTAL_CONNECTION_COUNT']++;
    return accumulator;
  },
  { TOTAL_CONNECTION_COUNT: 0 }
);
