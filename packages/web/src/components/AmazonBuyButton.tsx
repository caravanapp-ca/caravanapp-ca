import React from 'react';
import { makeStyles, Typography, Link } from '@material-ui/core';

export interface AmazonBuyButtonProps {
  link: string | undefined;
}

const useStyles = makeStyles(theme => ({
  chip: {},
  leftIcon: {
    color: 'white',
    marginRight: theme.spacing(1),
  },
}));

export default function AmazonBuyButton(props: AmazonBuyButtonProps) {
  const classes = useStyles();

  const { link } = props;

  return (
    <Link
      className={classes.chip}
      href={link ? link : 'http://bit.ly/2Y6Teus'}
      target={'_blank'}
    >
      <Typography variant="caption">BUY ON AMAZON</Typography>
    </Link>
  );
}
