import express from 'express';

import type { ProfileQuestionsDoc } from '@caravanapp/mongo';
import type { Services } from '@caravanapp/types';

import { getProfileQuestions } from '../services/profileQuestions';

const router = express.Router();

router.get('/questions', async (req, res, next) => {
  try {
    const profileQuestionsDoc = await getProfileQuestions();
    if (!profileQuestionsDoc) {
      res.status(500).send('No profile questions found, oops!');
      return;
    }
    // ProfileQuestionsDoc is not the correct type since it doesn't
    // have the Document obj properties, but good enough for now.
    const obj: ProfileQuestionsDoc = profileQuestionsDoc.toObject();
    const filtered = obj.questions.filter(q => q.visible);
    const resData: Services.GetProfileQuestions = {
      questions: filtered,
    };
    res.status(200).json(resData);
  } catch (err) {
    console.error('Failed to get profile questions.', err);
    return next(err);
  }
});

export default router;
