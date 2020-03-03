import React from 'react';
import { User, ClubTransformed } from '@caravanapp/buddy-reading-types';
import ClubCards from '../home/ClubCards';
import { Typography, useTheme, Container, makeStyles } from '@material-ui/core';

interface UserClubsProps {
  clubsTransformed: ClubTransformed[];
  user: User;
  userIsMe: boolean;
}

const useStyles = makeStyles(theme => ({
  clubCardsContainer: {
    padding: '32px 0px 32px 0px',
  },
}));

export default function UserClubs(props: UserClubsProps) {
  const { clubsTransformed, user, userIsMe } = props;
  const classes = useStyles();
  const theme = useTheme();
  if (user && clubsTransformed && clubsTransformed.length === 0) {
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
  return (
    <div className={classes.clubCardsContainer}>
      <ClubCards clubsTransformed={clubsTransformed} />
    </div>
  );
}
