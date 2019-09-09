import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, createStyles, Typography } from '@material-ui/core';
import { User } from '@caravan/buddy-reading-types';
import { RouteComponentProps } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
  })
);

interface RecommendedClubsProps extends RouteComponentProps<{}> {
  user: User | null;
}

export default function RecommendedClubs(props: RecommendedClubsProps) {
  const { user } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography>Here are some clubs we've hand picked for you!</Typography>
    </div>
  );
}
