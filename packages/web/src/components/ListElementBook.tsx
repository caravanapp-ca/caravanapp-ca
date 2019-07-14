import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Typography,
} from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import { Club } from '@caravan/buddy-reading-types';
import AdapterLink from './AdapterLink';
import GroupIcon from './misc-avatars-icons-labels/icons/GroupIcon';

export interface ListElementBookProps {
  id: string;
  index: number;
  clubId?: string;
  club?: Club;
  coverImage?: any;
  primaryText?: string;
  secondaryText?: string;
  primary?: JSX.Element;
  secondary?: JSX.Element;
  onClick?: any;
  selected?: boolean;
  draggable?: boolean;
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
    marginRight: theme.spacing(2),
  },
  clubNameContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

export default function ListElementBook(props: ListElementBookProps) {
  const classes = useStyles();

  const theme = useTheme();

  const {
    id,
    index,
    clubId,
    club,
    coverImage,
    primaryText,
    secondaryText,
    primary,
    secondary,
    selected,
    draggable,
  } = props;

  let shortenedTitle = primaryText;
  if (shortenedTitle && shortenedTitle.length > 99) {
    shortenedTitle = shortenedTitle.substring(0, 96) + '...';
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <ListItem
          // @ts-ignore
          button={clubId ? true : false}
          href={clubId ? `/clubs/${clubId}` : undefined}
          innerRef={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
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
            <Typography variant="body1">{shortenedTitle}</Typography>
            <Typography variant="body2" color="textSecondary">
              {secondaryText}
            </Typography>
          </div>
          {secondary && (
            <ListItemSecondaryAction>{secondary}</ListItemSecondaryAction>
          )}
        </ListItem>
      )}
    </Draggable>
  );
}
