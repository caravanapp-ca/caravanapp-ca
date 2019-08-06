import { ClubModel } from '@caravan/buddy-reading-mongo';

export const getClub = (clubId: string) => {
  return ClubModel.findById(clubId);
};
