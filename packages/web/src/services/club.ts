import axios from 'axios';
import {
  Services,
  ChannelSource,
  ShelfEntry,
  ReadingSpeed,
  User,
  FilterAutoMongoKeys,
  CurrBookAction,
  ReadingState,
} from '@caravan/buddy-reading-types';

const clubRoute = '/api/club';

interface CreateClubProps {
  name: string;
  shelf?: any;
  bio: string;
  maxMembers: string;
  vibe: string;
  readingSpeed: string;
  channelSource: ChannelSource;
  unlisted: boolean;
}

export async function getAllClubs(
  after?: string,
  pageSize?: number,
  readingSpeed?: ReadingSpeed
) {
  const res = await axios.get<Services.GetClubs>(clubRoute, {
    params: {
      after,
      pageSize,
      readingSpeed,
    },
  });
  return res;
}

export async function getClub(clubId: string) {
  const res = await axios.get<Services.GetClubById | null>(
    `${clubRoute}/${clubId}`
  );
  const club = res.data;
  return club;
}

export async function getClubsById(clubIds: string[]) {
  const res = await axios.post<Services.GetClubById[]>(
    `${clubRoute}/clubsById`,
    {
      clubIds,
    }
  );
  const clubs = res.data;
  return clubs;
}

export async function getUserClubs(userId: string) {
  const res = await axios.get<Services.GetClubs['clubs']>(
    `${clubRoute}/user/${userId}`
  );
  return res;
}

export async function modifyMyClubMembership(
  clubId: string,
  isMember: boolean
) {
  const res = await axios.put(`${clubRoute}/${clubId}/membership`, {
    isMember,
  });
  return res;
}

export async function deleteClub(clubId: string) {
  const res = await axios.delete(`${clubRoute}/${clubId}`);
  return res;
}

// export async function updateCurrentlyReadBook(
//   clubId: string,
//   newBook: FilterAutoMongoKeys<ShelfEntry> | ShelfEntry,
//   newEntry: boolean,
//   prevBookId: string | null,
//   currBookAction: CurrBookAction,
//   wantToRead: (ShelfEntry | FilterAutoMongoKeys<ShelfEntry>)[]
// ) {
//   const res = await axios.put(`${clubRoute}/${clubId}/updateBook`, {
//     newBook,
//     newEntry,
//     prevBookId,
//     currBookAction,
//     wantToRead,
//   });
//   return res;
// }

export async function updateShelf(
  clubId: string,
  newShelf: {
    [key in ReadingState]: (ShelfEntry | FilterAutoMongoKeys<ShelfEntry>)[]
  }
) {
  const res = await axios.put(`${clubRoute}/${clubId}/updateShelf`, {
    newShelf,
  });
  return res;
}

export async function createClub(props: CreateClubProps) {
  const body = {
    name: props.name,
    shelf: props.shelf,
    bio: props.bio,
    maxMembers: props.maxMembers,
    vibe: props.vibe,
    readingSpeed: props.readingSpeed,
    unlisted: props.unlisted,
    channelSource: props.channelSource,
  };

  const res = await axios.post<Services.CreateClubResult | null>(
    clubRoute,
    body
  );
  return res;
}

export async function modifyClub(newClub: Services.GetClubById) {
  const { _id } = newClub;
  const res = await axios.put(`${clubRoute}/${_id}`, {
    newClub,
  });
  return res;
}
