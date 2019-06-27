import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';

export interface JoinCaravanButtonProps {
  onClick: () => void;
}

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function JoinCaravanButton(props: JoinCaravanButtonProps) {
  const classes = useStyles();

  return (
    <Button
      variant="contained"
      color="secondary"
      className={classes.button}
      onClick={props.onClick}
    >
      <Typography variant="button">LOG IN</Typography>
    </Button>
  );
}
