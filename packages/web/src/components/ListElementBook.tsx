import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemText,
  Paper,
  ListItemIcon,
  ListItemSecondaryAction,
  Typography,
} from '@material-ui/core';
import { Club } from '@caravan/buddy-reading-types';
import AdapterLink from './AdapterLink';

export interface ListElementBookProps {
  clubId?: string;
  club?: Club;
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
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: theme.spacing(1),
  },
}));

export default function ListElementBook(props: ListElementBookProps) {
  const classes = useStyles();

  const {
    clubId,
    club,
    coverImage,
    primaryText,
    secondaryText,
    primary,
    secondary,
    selected,
  } = props;

  return (
    <ListItem
      // @ts-ignore
      button={clubId ? true : false}
      component={clubId ? AdapterLink : undefined}
      to={clubId ? `/clubs/${clubId}` : undefined}
    >
      {primary && <ListItemIcon>{primary}</ListItemIcon>}
      <img
        src={coverImage || require('../resources/generic-book-cover.jpg')}
        alt={primaryText}
        className={classes.coverImage}
      />
      <div className={classes.textContainer}>
        {club && (
          <Typography variant="body1" color="primary">
            {club.name}
          </Typography>
        )}
        <ListItemText
          primary={primaryText ? primaryText : 'Group member'}
          secondary={secondaryText ? secondaryText : null}
        />
      </div>
      {secondary && (
        <ListItemSecondaryAction>{secondary}</ListItemSecondaryAction>
      )}
    </ListItem>
  );
}
