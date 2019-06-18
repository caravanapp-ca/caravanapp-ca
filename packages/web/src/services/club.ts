import axios from 'axios';
import {
  ClubDoc,
  ShelfEntryDoc,
  GroupMemberDoc,
} from '@caravan/buddy-reading-types';

const clubRoute = '/api/club';

interface CreateClubProps {
  name: string;
  ownerId: string;
  shelf?: ShelfEntryDoc[];
  members?: GroupMemberDoc[];
  bio: string;
  maxMembers: string;
  vibe: string;
  readingSpeed: string;
}

export async function createClub(props: CreateClubProps) {
  const body = {
    name: props.name,
    ownerId: props.ownerId,
    shelf: props.shelf,
    members: props.members,
    bio: props.bio,
    maxMembers: props.maxMembers,
    vibe: props.vibe,
    readingSpeed: props.readingSpeed,
  };

  const res = await axios.post<ClubDoc | null>(clubRoute, body);
  console.log(res);
}
