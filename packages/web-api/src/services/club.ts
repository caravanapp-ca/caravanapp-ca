import { ShelfEntry } from '@caravan/buddy-reading-types';

const knownHttpsRedirects = ['http://books.google.com/books/'];

export const shelfEntryWithHttpsBookUrl = (shelfEntry: ShelfEntry) => {
  if (
    shelfEntry &&
    shelfEntry.coverImageURL &&
    knownHttpsRedirects.find(url => shelfEntry.coverImageURL.startsWith(url))
  ) {
    const newItem: ShelfEntry = {
      ...shelfEntry,
      coverImageURL: shelfEntry.coverImageURL.replace('http:', 'https:'),
    };
    return newItem;
  }
  return shelfEntry;
};
