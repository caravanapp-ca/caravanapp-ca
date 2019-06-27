import express from 'express';
import { Services, ProfileQuestions } from '@caravan/buddy-reading-types';
import ProfileQuestionsModel from '../models/profileQuestions';

const router = express.Router();

router.get('/questions', async (req, res, next) => {
  try {
    const profileQuestionsDoc = await ProfileQuestionsModel.findOne()
      .sort({ created_at: -1 })
      .exec();
    if (!profileQuestionsDoc) {
      res.status(500).send('No genres found, oops!');
      return;
    }
    const obj: ProfileQuestions = profileQuestionsDoc.toObject();
    const resData: Services.GetProfileQuestions = {
      questions: obj.questions,
    };
    res.status(200).json(resData);
  } catch (err) {
    console.error('Failed to get genres.', err);
    return next(err);
  }
});

export default router;
