import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

interface RFCTemplateProps {
  example?: string;
}

export default function RFCTemplate(props: RFCTemplateProps) {
  const { example } = props;
  const classes = useStyles();
  return <div />;
}
