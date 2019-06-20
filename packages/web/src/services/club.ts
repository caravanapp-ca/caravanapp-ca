import axios from 'axios';
import { Club, Services } from '@caravan/buddy-reading-types';

const clubRoute = '/api/club';

interface CreateClubProps {
  name: string;
  shelf?: any;
  bio: string;
  maxMembers: string;
  vibe: string;
  readingSpeed: string;
}

export async function getAllClubs() {
  const res = await axios.get<Club[]>(clubRoute);
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
  // Contains the Member Object for the added user. May be of use later.
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
  };

  const res = await axios.post<Club | null>(clubRoute, body);
  console.log(res);
}
