import ProfileQuestionsModel from '../models/profileQuestions';

export const getProfileQuestions = async () => {
  const profileQuestionsDoc = await ProfileQuestionsModel.findOne()
    .sort({ created_at: -1 })
    .exec();
  // TODO: Do aggregate + match + project to filter non-visible docs (???)
  return profileQuestionsDoc;
};
