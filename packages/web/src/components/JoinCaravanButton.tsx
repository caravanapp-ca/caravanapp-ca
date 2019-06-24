import React from 'react';
import { Button, makeStyles } from '@material-ui/core';

export interface JoinCaravanButtonProps {
  onClick: () => void;
}

const useStyles = makeStyles(theme => ({
  button: {
    'background-color': '#7289da',
    color: 'white',
    margin: theme.spacing(1),
  },
  leftIcon: {
    color: 'white',
    marginRight: theme.spacing(1),
  },
}));

export default function JoinCaravanButton(props: JoinCaravanButtonProps) {
  const classes = useStyles();

  return (
    <Button
      variant="contained"
      className={classes.button}
      onClick={props.onClick}
    >
      LOGIN TO CARAVAN
    </Button>
  );
}
