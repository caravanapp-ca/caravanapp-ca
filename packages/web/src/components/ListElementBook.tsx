import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemText,
  Paper,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@material-ui/core';

export interface ListElementBookProps {
  coverImage?: any;
  primaryText?: string;
  secondaryText?: string;
  primary?: JSX.Element;
  secondary?: JSX.Element;
  onClick?: any;
  selected?: boolean;
}

const useStyles = makeStyles(theme => ({
  coverImage: {
    height: 80,
    width: 50,
    borderRadius: 5,
    marginRight: 16,
    objectFit: 'cover',
    border: '1px solid #E9E9E9',
  },
}));

export default function ListElementBook(props: ListElementBookProps) {
  const classes = useStyles();

  const {
    coverImage,
    primaryText,
    secondaryText,
    primary,
    secondary,
    selected,
  } = props;

  return (
    <ListItem>
      {primary && <ListItemIcon>{primary}</ListItemIcon>}
      <img
        src={coverImage || require('../resources/generic-book-cover.jpg')}
        alt={primaryText}
        className={classes.coverImage}
      />
      <ListItemText
        primary={primaryText ? primaryText : 'Group member'}
        secondary={secondaryText ? secondaryText : null}
      />
      {secondary && (
        <ListItemSecondaryAction>{secondary}</ListItemSecondaryAction>
      )}
    </ListItem>
  );
}
