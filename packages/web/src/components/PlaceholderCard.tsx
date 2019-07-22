import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, createStyles, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      flexGrow: 1,
    },
  })
);

interface PlaceholderCardProps {
  height: number;
}

export default function PlaceholderCard(props: PlaceholderCardProps) {
  const { height } = props;
  const classes = useStyles();
  return (
    <div style={{ height }}>
      <Paper className={classes.paper} />
    </div>
  );
}
