import ProfileQuestionsModel from '../models/profileQuestions';

export const getProfileQuestions = async () => {
  const profileQuestionsDoc = await ProfileQuestionsModel.findOne()
    .sort({ created_at: -1 })
    .exec();
  return profileQuestionsDoc;
};
