import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemText,
  Paper,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { useTheme } from '@material-ui/styles';

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
  listItemText: {
    marginRight: theme.spacing(2),
  },
}));

export default function ListElementBook(props: ListElementBookProps) {
  const classes = useStyles();

  const theme = useTheme();

  const {
    coverImage,
    primaryText,
    secondaryText,
    primary,
    secondary,
    selected,
  } = props;

  let shortenedTitle = primaryText;
  if (shortenedTitle && shortenedTitle.length > 99) {
    shortenedTitle = shortenedTitle.substring(0, 96) + '...';
  }

  return (
    <ListItem>
      {primary && <ListItemIcon>{primary}</ListItemIcon>}
      <img
        src={coverImage || require('../resources/generic-book-cover.jpg')}
        alt={primaryText}
        className={classes.coverImage}
      />
      <ListItemText
        primary={shortenedTitle ? shortenedTitle : undefined}
        secondary={secondaryText ? secondaryText : undefined}
        className={classes.listItemText}
      />
      {secondary && (
        <ListItemSecondaryAction>{secondary}</ListItemSecondaryAction>
      )}
    </ListItem>
  );
}
