import { ClubRecommendationKey } from '@caravan/buddy-reading-types';

export const getClubRecommendationDescription = (
  key: ClubRecommendationKey,
  bookTitles?: string[],
  genres?: string[]
): string => {
  switch (key) {
    case 'currReadTBR':
      if (!bookTitles) {
        return 'This club is currently reading a book on your TBR!';
      }
      return `This club is currently reading ${bookTitles[0]}, which is on your TBR!`;
    case 'tBRMatch':
      if (!bookTitles) {
        return 'This club shares some TBRs with you!';
      }
      const randBook =
        bookTitles[Math.floor(Math.random() * bookTitles.length)];
      return `This clubs has ${bookTitles.length} matching TBRs with you, including ${randBook}.`;
    case 'genreMatch':
      if (!genres) {
        return 'This club has some genres in common with you!';
      }
      const randGenre = genres[Math.floor(Math.random() * genres.length)];
      return `This club has ${genres.length} genres in common with you, including ${randGenre}`;
    case 'new':
      return 'This club is new to Caravan!';
  }
};
