import axios from 'axios';
import {
  Club,
  Services,
  ChannelSource,
  ReadingSpeed,
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
  private: boolean;
}

export async function getAllClubs(
  after?: string,
  pageSize?: number,
  readingSpeed?: ReadingSpeed
) {
  const res = await axios.get<Club[]>(clubRoute, {
    params: {
      after,
      pageSize,
      readingSpeed,
    },
  });
  const clubs = res.data;
  return clubs;
}

export async function getClub(clubId: string) {
  const res = await axios.get<Services.GetClubById | null>(
    `${clubRoute}/${clubId}`
  );
  const club = res.data;
  return club;
}

export async function modifyMyClubMembership(
  clubId: string,
  isMember: boolean
) {
  const res = await axios.put(`${clubRoute}/${clubId}/membership`, {
    isMember,
  });
  // Contains the Member object for the added user. May be of use later.
  // const data = res.data;
  return res.status;
}

export async function createClub(props: CreateClubProps) {
  const body = {
    name: props.name,
    shelf: props.shelf,
    bio: props.bio,
    maxMembers: props.maxMembers,
    vibe: props.vibe,
    readingSpeed: props.readingSpeed,
    private: props.private,
    channelSource: props.channelSource,
  };

  const res = await axios.post<Services.CreateClubResult | null>(
    clubRoute,
    body
  );
  return res;
}
