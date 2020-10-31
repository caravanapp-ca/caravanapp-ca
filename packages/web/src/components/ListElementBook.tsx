import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Truncate from 'react-truncate';

import type { Services } from '@caravanapp/types';
import {
  Link,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  makeStyles,
  Typography,
} from '@material-ui/core';

import GroupIcon from './misc-avatars-icons-labels/icons/GroupIcon';

export interface ListElementBookProps {
  id: string;
  index: number;
  clubId?: string;
  club?: Services.GetClubs['clubs'][0];
  coverImage?: any;
  primaryText?: string;
  secondaryText?: string;
  primary?: JSX.Element;
  secondary?: JSX.Element;
  onClick?: any;
  draggable?: boolean;
  isDragging?: boolean;
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
  buyButton: {
    //marginTop: theme.spacing(1),
  },
}));

export default function ListElementBook(props: ListElementBookProps) {
  const classes = useStyles();

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
    draggable,
    isDragging,
  } = props;

  let shortenedTitle = primaryText;
  if (shortenedTitle && shortenedTitle.length > 99) {
    shortenedTitle = shortenedTitle.substring(0, 96) + '...';
  }

  // If you're making changes to the render here you will need to replicate them in both the draggable and regular cases.
  // TODO: Make this cleaner.
  if (draggable) {
    return (
      <Draggable draggableId={id} index={index}>
        {provided => (
          <ListItem
            // @ts-ignore
            button={!!clubId}
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
                <>
                  <Link href={clubId ? `/clubs/${clubId}` : undefined}>
                    <div className={classes.clubNameContainer}>
                      <GroupIcon color="primary" />
                      <Typography variant="body1" color="primary">
                        {club.name}
                      </Typography>
                    </div>
                  </Link>
                  <Typography
                    variant="body1"
                    color="textPrimary"
                    style={{ fontWeight: 600 }}
                  >
                    <Truncate lines={1} trimWhitespace={true}>
                      {primaryText}
                    </Truncate>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <Truncate lines={1} trimWhitespace={true}>
                      {secondaryText}
                    </Truncate>
                  </Typography>
                </>
              )}
              {!club && (
                <div>
                  <Typography variant="body1" style={{ fontWeight: 600 }}>
                    {shortenedTitle}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {secondaryText}
                  </Typography>
                </div>
              )}
            </div>
            <div>
              {secondary && !isDragging && (
                <ListItemSecondaryAction>{secondary}</ListItemSecondaryAction>
              )}
            </div>
          </ListItem>
        )}
      </Draggable>
    );
  } else {
    return (
      <ListItem
        // @ts-ignore
        button={!!clubId}
      >
        {primary && <ListItemIcon>{primary}</ListItemIcon>}
        <img
          src={coverImage || require('../resources/generic-book-cover.jpg')}
          alt={primaryText}
          className={classes.coverImage}
        />
        <div className={classes.textContainer}>
          {club && (
            <>
              <Link href={clubId ? `/clubs/${clubId}` : undefined}>
                <div className={classes.clubNameContainer}>
                  <GroupIcon color="primary" />
                  <Typography variant="body1" color="primary">
                    {club.name}
                  </Typography>
                </div>
              </Link>
              <Typography
                variant="body1"
                color="textPrimary"
                style={{ fontWeight: 600 }}
              >
                <Truncate lines={1} trimWhitespace={true}>
                  {primaryText}
                </Truncate>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <Truncate lines={1} trimWhitespace={true}>
                  {secondaryText}
                </Truncate>
              </Typography>
            </>
          )}
          {!club && (
            <div>
              <Typography variant="body1" style={{ fontWeight: 600 }}>
                {shortenedTitle}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {secondaryText}
              </Typography>
            </div>
          )}
        </div>
        {secondary && (
          <ListItemSecondaryAction>{secondary}</ListItemSecondaryAction>
        )}
      </ListItem>
    );
  }
}
