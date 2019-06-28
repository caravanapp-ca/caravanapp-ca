import ProfileQuestionsModel from '../models/profileQuestions';

export const getProfileQuestions = async () => {
  const profileQuestionsDoc = await ProfileQuestionsModel.findOne({
    createdAt: -1,
  }).exec();
  return profileQuestionsDoc;
};
