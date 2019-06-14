import express from 'express';
import ClubMember from '../models/club_member';

const router = express.Router();

// Get a club
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const clubMember = await ClubMember.findById(id);
    if (clubMember) {
      res.json(clubMember);
    } else {
      res.status(404).send('User not found')
    }
  } catch (err) {
    console.log(`Failed to get club member ${id}`, err);
    return next(err);
  }
});

// Create club
router.post('/', async (req, res, next) => {
  try {
    const clubMember = new ClubMember(req.body);
    const newClubMember = await clubMember.save();
    res.status(201).json(newClubMember);
  } catch (err) {
    console.log('Failed to create new club member', err);
    return next(err);
  }
});

// Modify a club
router.put('/:id', async (req, res, next) => {
  const editedClubMember = req.body;
  try {
    const doc = await ClubMember.findByIdAndUpdate(req.params.id, editedClubMember, {
      new: true,
    }).exec();
    res.sendStatus(200);
  } catch (err) {
    console.log(`Failed to modify club member ${req.params.id}`, err);
    return next(err);
  }
});

// Delete a club
router.delete('/:id', async (req, res, next) => {
  try {
    const record = await ClubMember.remove({ _id: req.params.id });
    res.sendStatus(200);
  } catch (err) {
    console.log(`Failed to delete club member ${req.params.id}`, err);
    return next(err);
  }
});

export default router;
