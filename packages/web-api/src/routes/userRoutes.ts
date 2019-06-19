import express from 'express';
import User from '../models/user';
import mongoose from 'mongoose';

const router = express.Router();

// Get a user
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (err) {
    const { code } = err;
    switch (code) {
      case 404:
        res.status(404).send(`User not found: ${id}`);
        return;
      default:
        console.log(`Failed to get user ${id}`, err);
        return next(err);
    }
  }
});

// Get users by array of userIds
router.post('/users', async (req, res, next) => {
  const { userIds } = req.body;
  if (Array.isArray(userIds)) {
    try {
      const userIdsAsObj = userIds.map(uid => mongoose.Types.ObjectId(uid));
      const users = await User.find({
        _id: { $in: userIdsAsObj },
      });
      res.json(users);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  } else {
    res
      .status(400)
      .send('Error: `userIds` must be an array of user id strings');
  }
});

// Create a user
router.post('/', async (req, res, next) => {
  try {
    const user = new User(req.body);
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.log('Failed to create new user', err);
    return next(err);
  }
});

// Modify a club
router.put('/:id', async (req, res, next) => {
  const editedClub = req.body;
  const { id } = req.params;
  try {
    const doc = await User.findByIdAndUpdate(id, editedClub, {
      new: true,
    }).exec();
    res.sendStatus(200);
  } catch (err) {
    console.log(`Failed to modify user ${id}`, err);
    return next(err);
  }
});

export default router;
