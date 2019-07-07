import React from 'react';
import { ClubWithCurrentlyReading } from '../home/Home';
import { User } from '@caravan/buddy-reading-types';
import ClubCards from '../home/ClubCards';
import { Typography, useTheme, Container } from '@material-ui/core';

interface UserClubsProps {
  clubsWCR: ClubWithCurrentlyReading[];
  user: User;
  userIsMe: boolean;
}

export default function UserClubs(props: UserClubsProps) {
  const { clubsWCR, user, userIsMe } = props;
  const theme = useTheme();
  if (user && clubsWCR && clubsWCR.length === 0) {
    let noClubsMessage = 'This user has not yet joined any clubs.';
    if (userIsMe) {
      noClubsMessage =
        "You haven't joined or created any clubs yet! Head back to the home page to get into the action!";
    }
    return (
      <Container maxWidth="md">
        <Typography
          color="textSecondary"
          style={{
            textAlign: 'center',
            fontStyle: 'italic',
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(4),
          }}
        >
          {noClubsMessage}
        </Typography>
      </Container>
    );
  }
  return <ClubCards clubsWCR={clubsWCR} user={user} />;
}
