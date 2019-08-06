import { ShelfEntry } from "@caravan/buddy-reading-types";

const knownHttpsRedirects = ["http://books.google.com/books/"];

export const getClubUrl = (clubId: string) =>
  `https://caravanapp.ca/clubs/${clubId}`;

// 1024 is Discord limit, so shorten the bio by the club url and two
// for new lines.
export const getDefaultClubTopic = (clubUrl: string, bio: string) =>
  `${clubUrl}\n\n${bio.substr(0, 1024 - clubUrl.length - 2)}`;

export const shelfEntryWithHttpsBookUrl = (shelfEntry: ShelfEntry) => {
  if (
    shelfEntry &&
    shelfEntry.coverImageURL &&
    knownHttpsRedirects.find(url => shelfEntry.coverImageURL.startsWith(url))
  ) {
    const newItem: ShelfEntry = {
      ...shelfEntry,
      coverImageURL: shelfEntry.coverImageURL.replace("http:", "https:")
    };
    return newItem;
  }
  return shelfEntry;
};
