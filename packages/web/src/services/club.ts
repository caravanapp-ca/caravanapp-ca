import axios from 'axios';
import {
  ClubDoc,
  ShelfEntryDoc,
  GroupMemberDoc,
} from '@caravan/buddy-reading-types';

const clubRoute = '/api/club';

interface CreateClub {
  name: string;
  ownerId: string;
  shelf: ShelfEntryDoc[];
  members: GroupMemberDoc[];
  bio: string;
  maxMembers: number;
  vibe: string;
  readingSpeed: string;
}

export async function createClub(props: CreateClub) {
  const body = {
    name: props.name,
    ownerId: props.ownerId,
    shelf: props.shelf,
    etc,
  };
  const res = await axios.post<ClubDoc | null>(clubRoute, body);
  const userDoc = res.data;
  return userDoc;
}
