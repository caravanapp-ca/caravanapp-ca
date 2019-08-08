import {
  Club,
  ShelfEntry,
  FilterAutoMongoKeys,
  ReadingState,
  GoogleBooks,
  ClubReadingSchedule,
  Services,
  ClubTransformed,
} from '@caravan/buddy-reading-types';
import { scheduleStrToDates } from '../../../common/scheduleStrToDates';

export function getCurrentBook(club: Club): ShelfEntry | null {
  if (club && club.shelf) {
    const book = club.shelf.find(book => book.readingState === 'current');
    if (book) {
      return book;
    }
  }
  return null;
}

export function getCurrentSchedule(
  club: Club,
  currBook: ShelfEntry
): ClubReadingSchedule | null {
  if (club && club.schedules) {
    let schedule = club.schedules.find(s => s.shelfEntryId === currBook._id);
    if (schedule) {
      schedule = scheduleStrToDates(schedule);
      return schedule;
    }
  }
  return null;
}

export const transformClub = (club: Services.GetClubs['clubs'][0]) => {
  const currentlyReading =
    club.shelf.find(book => book.readingState === 'current') || null;
  const transformedClub: ClubTransformed = {
    club,
    currentlyReading,
    schedule: null,
  };
  if (currentlyReading) {
    let schedule = club.schedules.find(
      sched => sched.shelfEntryId === currentlyReading._id
    );
    if (schedule) {
      schedule = scheduleStrToDates(schedule);
      transformedClub.schedule = schedule;
    }
  }
  return transformedClub;
};

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
