import React from 'react';
import { ClubWithCurrentlyReading } from '../home/Home';
import { User } from '@caravan/buddy-reading-types';
import ClubCards from '../home/ClubCards';

interface UserClubsProps {
  clubsWCR: ClubWithCurrentlyReading[];
  user: User;
}

export default function UserClubs(props: UserClubsProps) {
  const { clubsWCR, user } = props;
  return <ClubCards clubsWCR={clubsWCR} user={user} />;
}
