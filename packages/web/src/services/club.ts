import axios from 'axios';
import {
  Services,
  ChannelSource,
  ShelfEntry,
  FilterAutoMongoKeys,
  CurrBookAction,
  ReadingState,
  ActiveFilter,
  SelectedGenre,
  ClubWUninitSchedules,
  UserWithInvitableClubs,
  User,
} from '@caravan/buddy-reading-types';
import { getRandomInviteMessage } from '../functions/getRandomInviteMessage';

const clubRoute = '/api/club';
const discordRoute = '/api/discord';

interface CreateClubProps {
  name: string;
  shelf?: any;
  bio: string;
  maxMembers: string;
  vibe: string;
  genres: SelectedGenre[];
  readingSpeed: string;
  channelSource: ChannelSource;
  unlisted: boolean;
}

export async function getAllClubs(
  userId?: string,
  after?: string,
  pageSize?: number,
  activeFilter?: ActiveFilter,
  search?: string
) {
  const res = await axios.get<Services.GetClubs>(clubRoute, {
    params: {
      userId,
      after,
      pageSize,
      activeFilter,
      search,
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

export async function getClubsByIdNoMembers(clubIds: string[]) {
  const res = await axios.post<Services.GetClubs>(
    `${clubRoute}/getClubsByIdNoMembers`,
    {
      clubIds,
    }
  );
  return res;
}

export async function getClubsByIdWMembers(clubIds: string[]) {
  const res = await axios.post<Services.GetClubById[]>(
    `${clubRoute}/getClubsByIdWMembers`,
    {
      clubIds,
    }
  );
  const clubs = res.data;
  return clubs;
}

export async function getUserClubsWithMembers(
  userId: string,
  after?: string,
  pageSize?: number,
  activeFilter?: ActiveFilter
) {
  const res = await axios.get<Services.GetClubById[]>(
    `${clubRoute}/wMembers/user/${userId}`,
    {
      params: {
        after,
        pageSize,
        activeFilter,
      },
    }
  );
  return res;
}

export async function getClubMembers(clubId: string) {
  const res = await axios.get<User[]>(`${clubRoute}/members/${clubId}`, {
    params: {
      clubId,
    },
  });
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
    genres: props.genres,
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

export async function modifyClub(
  newClub: Services.GetClubById | ClubWUninitSchedules
) {
  const { _id } = newClub;
  const res = await axios.put(`${clubRoute}/${_id}`, {
    newClub,
  });
  return res;
}

export async function inviteToClub(
  currentUser: User,
  userToInvite: UserWithInvitableClubs,
  clubName: string,
  clubId: string
) {
  const messageContent = getRandomInviteMessage(
    currentUser.name || currentUser.urlSlug || 'A Caravan user',
    clubName,
    clubId
  );
  const res = await axios.post(
    `${discordRoute}/members/${userToInvite.user.discordId}/messages`,
    {
      messageContent,
    }
  );
  return res;
}
