import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Typography } from '@material-ui/core';
import { MoreVert, ArrowBack } from '@material-ui/icons';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import { RouteComponentProps } from 'react-router-dom';
import { User } from '@caravan/buddy-reading-types';

interface UpdateBookRouteParams {
  id: string;
}

interface UpdateBookProps extends RouteComponentProps<UpdateBookRouteParams> {
  user: User | null;
}

const useStyles = makeStyles(theme => ({}));

export default function UpdateBook(props: UpdateBookProps) {
  const classes = useStyles();

  const leftComponent = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Back"
      onClick={() => props.history.goBack()}
    >
      <ArrowBack />
    </IconButton>
  );

  const centerComponent = <Typography variant="h6">Update Club</Typography>;

  const rightComponent = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="More"
      component={AdapterLink}
      to="/"
    >
      <MoreVert />
    </IconButton>
  );

  return (
    <Header
      leftComponent={leftComponent}
      centerComponent={centerComponent}
      rightComponent={rightComponent}
    />
  );
}
