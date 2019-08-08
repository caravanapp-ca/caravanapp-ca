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

  // Note: for now we're just linking to the Amazon Books page
  // const { link } = props;

  return (
    <Link
      className={classes.chip}
      href={
        'https://www.amazon.com/b?_encoding=UTF8&tag=caravanclub0a-20&linkCode=ur2&linkId=7c2b4dc572c63afc5fd43f7a00dfbeaf&camp=1789&creative=9325&node=283155'
      }
      target={'_blank'}
    >
      <Typography variant="caption">BUY ON AMAZON</Typography>
    </Link>
  );
}
