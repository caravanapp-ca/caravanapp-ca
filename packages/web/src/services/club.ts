import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  Services,
  ShelfEntry,
  FilterAutoMongoKeys,
  ReadingState,
  ActiveFilter,
  ClubWUninitSchedules,
  User,
  ClubWithRecommendation,
} from '@caravan/buddy-reading-types';
import {
  getRandomInviteMessage,
  getRandomInviteMessageFromShelf,
} from '../common/getRandomInviteMessage';
import { getUser } from './user';

const clubRoute = '/api/club';
const discordRoute = '/api/discord';

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

export async function getUserClubRecommendations(
  userId: string,
  pageSize?: number,
  blockedClubIds?: string[]
) {
  const blockedClubIdsStr = blockedClubIds ? blockedClubIds.join() : undefined;
  const res = await axios.get<ClubWithRecommendation[]>(
    `${clubRoute}/user/recommendations`,
    {
      params: {
        userId,
        pageSize,
        blockedClubIds: blockedClubIdsStr,
      },
    }
  );
  return res;
}

export const getUserReferralClub = async (userId: string) => {
  try {
    const res = await axios.get<ClubWithRecommendation>(
      `${clubRoute}/user/referrals`,
      {
        params: {
          userId,
        },
      }
    );
    return res;
  } catch (err) {
    const errTyped: AxiosError = err;
    return errTyped.response;
  }
};

export const joinMyReferralClubs = async () => {
  try {
    const res = await axios.put<User[]>(`${clubRoute}/joinMyReferralClubs`);
    return res;
  } catch (err) {
    const errTyped: AxiosError = err;
    return errTyped.response;
  }
};

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
  const res = await axios.put<User[]>(`${clubRoute}/${clubId}/membership`, {
    isMember,
  });
  return res;
}

export async function deleteClub(clubId: string) {
  const res = await axios.delete(`${clubRoute}/${clubId}`);
  return res;
}

export async function updateShelf(
  clubId: string,
  newShelf: {
    [key in ReadingState]: (ShelfEntry | FilterAutoMongoKeys<ShelfEntry>)[];
  }
) {
  const res = await axios.put(`${clubRoute}/${clubId}/shelf`, {
    newShelf,
  });
  return res;
}

export async function createClub(body: Services.CreateClubProps) {
  const res = await axios.post<Services.CreateClubResult | null>(
    clubRoute,
    body
  );
  return res;
}

export async function sendInvitesToClubFromShelf(
  res: AxiosResponse<Services.CreateClubResult | null>,
  props: Services.CreateClubProps
) {
  if (
    res.status >= 200 &&
    res.status < 300 &&
    props.currUser &&
    props.currUser !== null &&
    props.usersToInviteIds &&
    props.usersToInviteIds.length > 0 &&
    res.data &&
    res.data.club &&
    res.data.club._id
  ) {
    props.usersToInviteIds.map(async userId => {
      const user = await getUser(userId);
      if (user && user.discordId) {
        // ts-ignore here because it  doesn't recognize that res.data.club_id and props.currUser can't be null due to
        // the if statement above
        inviteToClubFromShelf(
          //@ts-ignore
          props.currUser,
          user.discordId,
          props.name,
          //@ts-ignore
          res.data.club._id
        );
      }
    });
  }
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
  userToInviteDiscordId: string,
  clubName: string,
  clubId: string
) {
  const messageContent = getRandomInviteMessage(
    currentUser.name || currentUser.urlSlug || 'A Caravan user',
    clubName,
    clubId
  );
  const res = await axios.post(
    `${discordRoute}/members/${userToInviteDiscordId}/messages`,
    {
      messageContent,
    }
  );
  return res;
}

export async function inviteToClubFromShelf(
  currentUser: User,
  userToInviteDiscordId: string,
  clubName: string,
  clubId: string
) {
  const messageContent = getRandomInviteMessageFromShelf(
    currentUser.name || currentUser.urlSlug || 'A Caravan user',
    clubName,
    clubId
  );
  const res = await axios.post(
    `${discordRoute}/members/${userToInviteDiscordId}/messages`,
    {
      messageContent,
    }
  );
  return res;
}
