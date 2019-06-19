import express from 'express';
import Club from '../models/club';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

// TODO: Need to add checks here: Is the club full? Is the club private? => Don't return
router.get('/', async (req, res, next) => {
  try {
    const clubs = await Club.find({});
    if (clubs) {
      res.status(200).json(clubs);
    }
  } catch (err) {
    console.error('Failed to get all clubs.', err);
    return next(err);
  }
});

// Get a club
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const club = await Club.findById(id);
    if (club) {
      res.json(club);
    } else {
      res.status(404).send(null);
    }
  } catch (err) {
    if (err.name) {
      switch (err.name) {
        case 'CastError':
          res.status(404).send(null);
          return;
        default:
          break;
      }
    }
    console.log(`Failed to get club ${id}`, err);
    return next(err);
  }
});

// Create club
router.post('/', isAuthenticated, async (req, res, next) => {
  try {
    const club = new Club(req.body);
    const newClub = await club.save();
    res.status(201).json(newClub);
  } catch (err) {
    console.log('Failed to create new club', err);
    return next(err);
  }
});

// Modify a club
router.put('/:id', isAuthenticated, async (req, res, next) => {
  const editedClub = req.body;
  try {
    const doc = await Club.findByIdAndUpdate(req.params.id, editedClub, {
      new: true,
    }).exec();
    res.sendStatus(200);
  } catch (err) {
    console.log(`Failed to modify club ${req.params.id}`, err);
    return next(err);
  }
});

// Delete a club
router.delete('/:id', isAuthenticated, async (req, res, next) => {
  try {
    const record = await Club.remove({ _id: req.params.id });
    res.sendStatus(204);
  } catch (err) {
    console.log(`Failed to delete club ${req.params.id}`, err);
    return next(err);
  }
});

// Modify current user's club membership
router.put('/:id/membership', isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const clubId = req.params.id;
    const { isMember } = req.body;
    if (isMember) {
      const condition = { _id: clubId, 'members.userId': { $ne: userId } };
      const update = {
        $addToSet: {
          members: {
            userId,
            role: 'member',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      };
      const result = await Club.findOneAndUpdate(condition, update, {
        new: true,
      });
      const userMembership = result.members.find(mem =>
        mem.userId.equals(userId)
      );
      res.status(200).json(userMembership);
    } else if (!isMember) {
      const update = {
        $pull: {
          members: {
            userId,
          },
        },
      };
      const result = await Club.findByIdAndUpdate(clubId, update);
      res.sendStatus(200);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;
