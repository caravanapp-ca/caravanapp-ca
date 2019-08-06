import {
  checkObjectIdIsValid,
  UserDoc,
  UserModel,
} from '@caravan/buddy-reading-mongo';

export const getUser = async (urlSlugOrId: string) => {
  const isObjId = checkObjectIdIsValid(urlSlugOrId);
  let user: UserDoc | null;
  if (!isObjId) {
    user = await UserModel.findOne({ urlSlug: urlSlugOrId });
  } else {
    user = await UserModel.findById(urlSlugOrId);
  }
  return user;
};
