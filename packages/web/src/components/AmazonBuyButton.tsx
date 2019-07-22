import React from 'react';
import { Button, makeStyles, Typography, Chip } from '@material-ui/core';

export interface AmazonBuyButtonProps {}

const useStyles = makeStyles(theme => ({
  chip: {
    textTransform: 'none',
  },
  leftIcon: {
    color: 'white',
    marginRight: theme.spacing(1),
  },
}));

export default function AmazonBuyButton(props: AmazonBuyButtonProps) {
  const classes = useStyles();

  return (
    <Chip
      label="BUY ON AMAZON"
      className={classes.chip}
      color="primary"
      variant="outlined"
      clickable
    />
  );
}
