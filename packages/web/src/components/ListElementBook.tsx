import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Typography,
  Link,
} from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import { Services } from '@caravan/buddy-reading-types';
import GroupIcon from './misc-avatars-icons-labels/icons/GroupIcon';
import Truncate from 'react-truncate';

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
  tertiary?: JSX.Element;
  tertiaryLink?: string;
  onClick?: any;
  selected?: boolean;
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
    tertiary,
    selected,
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
        {(provided, snapshot) => (
          <ListItem
            // @ts-ignore
            button={clubId ? true : false}
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
              {tertiary && <div className={classes.buyButton}>{tertiary}</div>}
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
        button={clubId ? true : false}
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
          {tertiary && <div className={classes.buyButton}>{tertiary}</div>}
        </div>
        {secondary && (
          <ListItemSecondaryAction>{secondary}</ListItemSecondaryAction>
        )}
      </ListItem>
    );
  }
}
