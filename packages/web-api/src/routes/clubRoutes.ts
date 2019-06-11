import express from 'express';
import Club from '../models/club';

const router = express.Router();

// Get a club
router.get('/:id', async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    res.json(club);
  } catch (err) {
    console.log(`Failed to get club ${req.params.id}`, err);
    return next(err);
  }
});

// Create club
router.post('/', async (req, res, next) => {
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
router.put('/:id', async (req, res, next) => {
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
router.delete('/:id', async (req, res, next) => {
  try {
    const record = await Club.remove({ _id: req.params.id });
    res.sendStatus(200);
  } catch (err) {
    console.log(`Failed to delete club ${req.params.id}`, err);
    return next(err);
  }
});

export default router;
