import React from 'react';
import { Typography } from '@material-ui/core';

interface HeaderTitleProps {
  title: String;
}

export default function HeaderTitle(props: HeaderTitleProps) {
  const { title } = props;
  return (
    <Typography variant="h5" color="textPrimary">
      {title}
    </Typography>
  );
}
