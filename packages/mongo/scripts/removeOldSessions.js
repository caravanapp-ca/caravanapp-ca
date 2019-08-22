/**
 * This is used when there are unnecessary session documents that should be cleaned up.
 */

/**
 * Gets all the latest sessions for each user and outputs to an array of ids
 */
db.getCollection('sessions').aggregate([
  { $match: { client: 'discord' } }, // Consider changing the client
  { $sort: { accessTokenExpiresAt: 1 } }, // Care about the newest documents
  { $group: { _id: '$userId', lastId: { $last: '$_id' } } },
  { $group: { _id: '$lastIds', ids: { $push: '$lastId' } } },
  { $project: { _id: 0, ids: 1 } },
]);
/* Will return something like
{
    "ids" : [
        ObjectId("5d5d721a9dc16909d439222b"),
        ObjectId("5d5c3ac5c9872000240f0afe"),
        ObjectId("5d3b5248a798cd3b587804bf"),
        ObjectId("5d4346e80a63daa8fd00326c"),
        ObjectId("5d3b4abb92354b3a0ffd90cc"),
        ObjectId("5d4c942c581e3a0024b47128"),
        ObjectId("5d5ac41e90b5df5f77b4c2d7"),
        ObjectId("5d5c2a00d6247b3a0cda9cf3"),
        ObjectId("5d323bcec7d4610891e9fe88"),
        ObjectId("5d5ac2b2440d7e5ed9214cb6"),
        ObjectId("5d1d2793f2b98f4b5a9aef10"),
        ObjectId("5d5c3d06c9872000240f0b01"),
        ObjectId("5d4af01f7ee2e8cba6a8cf50")
    ]
}
 */

/**
 * Copy the result from the previous query and paste in the $nin
 * to find all the sessions that are old. Consider validating the result.
 * Then, replace the .find with .remove to remove the old sessions.
 */
db.sessions.find({
  _id: {
    $nin: [
      ObjectId('5d5c3ac5c9872000240f0afe'),
      ObjectId('5d3b5248a798cd3b587804bf'),
      ObjectId('5d4346e80a63daa8fd00326c'),
      ObjectId('5d3b4abb92354b3a0ffd90cc'),
      ObjectId('5d4c942c581e3a0024b47128'),
      ObjectId('5d5c2a00d6247b3a0cda9cf3'),
      ObjectId('5d5ac41e90b5df5f77b4c2d7'),
      ObjectId('5d323bcec7d4610891e9fe88'),
      ObjectId('5d5ac2b2440d7e5ed9214cb6'),
      ObjectId('5d1d2793f2b98f4b5a9aef10'),
      ObjectId('5d5d3e1a82e3e9a5088fb56a'),
      ObjectId('5d5c3d06c9872000240f0b01'),
      ObjectId('5d4af01f7ee2e8cba6a8cf50'),
    ],
  },
});
