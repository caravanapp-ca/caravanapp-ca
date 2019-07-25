import React from 'react';
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

  const theme = useTheme();

  const {
    clubId,
    club,
    coverImage,
    primaryText,
    secondaryText,
    primary,
    secondary,
    tertiary,
    selected,
  } = props;

  let shortenedTitle = primaryText;
  if (shortenedTitle && shortenedTitle.length > 99) {
    shortenedTitle = shortenedTitle.substring(0, 96) + '...';
  }

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
          <Link href={clubId ? `/clubs/${clubId}` : undefined}>
            <div className={classes.clubNameContainer}>
              <GroupIcon color="primary" />
              <Typography variant="body1" color="primary">
                {club.name}
              </Typography>
            </div>
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
          </Link>
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
