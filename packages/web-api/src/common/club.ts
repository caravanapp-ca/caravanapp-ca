import { ClubRecommendationKey } from '@caravan/buddy-reading-types';

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
      const randBook =
        bookTitles[Math.floor(Math.random() * bookTitles.length)];
      return `This club has ${bookTitles.length} matching TBR${
        bookTitles.length > 1 ? 's' : ''
      } with you, ${bookTitles.length > 1 ? 'including ' : ''}${randBook}.`;
    case 'genreMatch':
      if (!genreNames || genreNames.length === 0) {
        return 'This club has some genres in common with you!';
      }
      const randGenre =
        genreNames[Math.floor(Math.random() * genreNames.length)];
      return `This club has ${genreNames.length} genre${
        genreNames.length > 1 ? 's' : ''
      } in common with you, ${
        genreNames.length > 1 ? 'including ' : ''
      }${randGenre}.`;
    case 'new':
      return 'This club is new to Caravan!';
  }
};
