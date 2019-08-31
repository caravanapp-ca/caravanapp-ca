import React from 'react';
import { makeStyles, Typography, Link } from '@material-ui/core';

export interface AmazonBuyButtonProps {
  link: string | undefined;
}

export default function AmazonBuyButton(props: AmazonBuyButtonProps) {
  // Note: for now we're just linking to the Amazon Books page
  const { link } = props;

  return (
    <Link href={link} target={'_blank'}>
      <Typography variant="caption">BUY ON AMAZON</Typography>
    </Link>
  );
}
