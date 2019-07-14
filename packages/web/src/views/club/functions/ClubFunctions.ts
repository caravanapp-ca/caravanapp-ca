import {
  Club,
  ShelfEntry,
  FilterAutoMongoKeys,
  ReadingState,
  GoogleBooks,
} from '@caravan/buddy-reading-types';

export function getCurrentBook(club: Club): ShelfEntry | null {
  const currBook = club.shelf.find(b => b.readingState === 'current');
  return currBook || null;
}

export function sortShelf(club: Club): { [key in ReadingState]: ShelfEntry[] } {
  const sortedShelf: { [key in ReadingState]: ShelfEntry[] } = {
    current: [],
    notStarted: [],
    read: [],
  };
  club.shelf.forEach(book => {
    sortedShelf[book.readingState].push(book);
  });
  return sortedShelf;
}

export function getShelfFromGoogleBooks(
  selectedBooks: GoogleBooks.Item[],
  currentBookId?: string
) {
  if (selectedBooks) {
    const result = selectedBooks.map(book => {
      let readingState: ReadingState = 'notStarted';
      if (currentBookId && book.id === currentBookId) {
        readingState = 'current';
      }
      const res: FilterAutoMongoKeys<ShelfEntry> = {
        source: 'google',
        sourceId: book.id,
        readingState,
        title: book.volumeInfo.title,
        genres: book.volumeInfo.categories || [],
        author: (book.volumeInfo.authors || ['Unknown author']).join(', '),
        isbn:
          'industryIdentifiers' in book.volumeInfo
            ? book.volumeInfo.industryIdentifiers[0].identifier
            : undefined,
        publishedDate:
          'publishedDate' in book.volumeInfo
            ? book.volumeInfo.publishedDate
            : undefined,
        coverImageURL:
          'imageLinks' in book.volumeInfo
            ? book.volumeInfo.imageLinks.thumbnail
            : require('../../../resources/generic-book-cover.jpg'),
      };
      return res;
    });
    return result;
  } else {
    return [];
  }
}
