import { ClubModel } from '../workspace/mongo/models/club';

export const getClub = (clubId: string) => {
  return ClubModel.findById(clubId);
};
