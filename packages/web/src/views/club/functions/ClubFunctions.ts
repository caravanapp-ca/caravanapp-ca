import {
  Club,
  ShelfEntry,
  FilterAutoMongoKeys,
  ReadingState,
  GoogleBooks,
  ClubReadingSchedule,
} from '@caravan/buddy-reading-types';
import { scheduleStrToDates } from '../../../functions/scheduleStrToDates';

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
