import { ClubRecommendationKey } from '@caravan/buddy-reading-types';
import { getRandItemList } from './functions';

export const getClubRecommendationDescription = (
  key: ClubRecommendationKey,
  bookTitles?: string[],
  genreNames?: string[]
): string => {
  switch (key) {
    case 'currReadTBR':
      if (!bookTitles || bookTitles.length === 0) {
        return 'This club is currently reading a book on your TBR!';
      }
      return `This club is currently reading ${bookTitles[0]}, which is on your TBR!`;
    case 'tBRMatch':
      if (!bookTitles || bookTitles.length === 0) {
        return 'This club shares some TBRs with you!';
      }
      return `This club has ${bookTitles.length} matching TBR${
        bookTitles.length > 1 ? 's' : ''
      } with you, ${getRandItemList(bookTitles, 2)}`;
    case 'genreMatch':
      if (!genreNames || genreNames.length === 0) {
        return 'This club has some genres in common with you!';
      }
      return `This club has ${genreNames.length} matching genre${
        genreNames.length > 1 ? 's' : ''
      } with you, ${getRandItemList(genreNames, 3)}`;
    case 'new':
      return 'This club is new to Caravan!';
  }
};
