import axios from 'axios';
import { Club } from '@caravan/buddy-reading-types';

const clubRoute = '/api/club';

export async function getClub(clubId: string) {
  const res = await axios.get<Club | null>(`${clubRoute}/${clubId}`);
  const club = res.data;
  return club;
}
