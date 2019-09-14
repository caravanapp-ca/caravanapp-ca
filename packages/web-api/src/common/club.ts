import { ClubRecommendationKey } from '@caravan/buddy-reading-types';

const getRandItemList = (
  items: string[],
  numItemsToInclude: number
): string => {
  const numItemsToUse = Math.min(Math.max(numItemsToInclude, 1), items.length);
  if (numItemsToUse === 0) {
    return '';
  }
  const itemsToUse: string[] = [];
  let itemsCopy = [...items];
  for (let i = 0; i < numItemsToUse; i++) {
    const randIndex = Math.floor(Math.random() * itemsCopy.length);
    itemsToUse.push(itemsCopy[randIndex]);
    itemsCopy.splice(randIndex, 1);
  }
  if (itemsToUse.length === 1) {
    return itemsToUse[0];
  }
  let itemsStr = '';
  if (numItemsToInclude < items.length) {
    itemsStr += 'including ';
  }
  const sliceLastItem = itemsToUse.slice(0, itemsToUse.length - 1);
  itemsStr += sliceLastItem.join(', ');
  itemsStr += ` and ${itemsToUse[itemsToUse.length - 1]}`;
  return itemsStr;
};

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
