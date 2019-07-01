import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Typography,
} from '@material-ui/core';
import { Club } from '@caravan/buddy-reading-types';
import AdapterLink from './AdapterLink';
import GroupIcon from './misc-avatars-icons-labels/icons/GroupIcon';

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
  clubNameContainer: {
    display: 'flex',
    flexDirection: 'row',
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
          <div className={classes.clubNameContainer}>
            <GroupIcon color="primary" />
            <Typography variant="body1" color="primary">
              {club.name}
            </Typography>
          </div>
        )}
        <Typography variant="body1">{primaryText}</Typography>
        <Typography variant="body2" color="textSecondary">
          {secondaryText}
        </Typography>
      </div>
      {secondary && (
        <ListItemSecondaryAction>{secondary}</ListItemSecondaryAction>
      )}
    </ListItem>
  );
}
