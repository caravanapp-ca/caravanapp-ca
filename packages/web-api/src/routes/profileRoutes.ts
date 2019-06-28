import express from 'express';
import { Services, ProfileQuestions } from '@caravan/buddy-reading-types';
import { getProfileQuestions } from '../services/profileQuestions';

const router = express.Router();

router.get('/questions', async (req, res, next) => {
  try {
    const profileQuestionsDoc = await getProfileQuestions();
    if (!profileQuestionsDoc) {
      res.status(500).send('No profile questions found, oops!');
      return;
    }
    const obj: ProfileQuestions = profileQuestionsDoc.toObject();
    const resData: Services.GetProfileQuestions = {
      questions: obj.questions,
    };
    res.status(200).json(resData);
  } catch (err) {
    console.error('Failed to get profile questions.', err);
    return next(err);
  }
});

export default router;
