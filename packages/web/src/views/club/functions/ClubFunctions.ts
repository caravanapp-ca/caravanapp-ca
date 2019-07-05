import {
  Club,
  ShelfEntry,
  FilterAutoMongoKeys,
  ReadingState,
  GoogleBooks,
} from '@caravan/buddy-reading-types';

export function getCurrentBook(club: Club): ShelfEntry | null {
  if (club && club.shelf) {
    const book = club.shelf.find(book => book.readingState === 'current');
    if (book) {
      return book;
    }
  }
  return null;
}

export function getWantToRead(club: Club): ShelfEntry[] {
  if (club && club.shelf) {
    const wantToRead = club.shelf.filter(
      book => book.readingState === 'notStarted'
    );
    return wantToRead;
  }
  return [];
}

export function getShelfFromGoogleBooks(
  selectedBooks: GoogleBooks.Item[],
  currentBookId?: string
) {
  const result = selectedBooks.map(book => {
    let readingState: ReadingState = 'notStarted';
    if (currentBookId && book.id === currentBookId) {
      readingState = 'current';
    }
    const res: FilterAutoMongoKeys<ShelfEntry> = {
      source: 'google',
      sourceId: book.id,
      readingState: readingState,
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
}
