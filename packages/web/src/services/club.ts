import axios from 'axios';
import { Club } from '@caravan/buddy-reading-types';

const clubRoute = '/api/club';

export async function getAllClubs() {
  const res = await axios.get<Club[]>(`${clubRoute}/all`);
  const clubs = res.data;
  return clubs;
}

export async function getClub(clubId: string) {
  const res = await axios.get<Club | null>(`${clubRoute}/${clubId}`);
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
  // Contains the Member type for the added user. May be of use later.
  // const data = res.data;
  return res.status;
}
