import { ProfileQuestionsModel } from '@caravanapp/buddy-reading-mongo';

export const getProfileQuestions = async () => {
  const profileQuestionsDoc = await ProfileQuestionsModel.findOne()
    .sort({ createdAt: -1 })
    .exec();
  // TODO: Do aggregate + match + project to filter non-visible docs (???)
  return profileQuestionsDoc;
};
