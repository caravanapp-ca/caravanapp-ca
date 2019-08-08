import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import AdapterLink from './AdapterLink';
import { UserBadge } from '@caravan/buddy-reading-types';
import UserBadgeIcon from './UserBadgeIcon';
import { Typography, makeStyles, Theme, createStyles } from '@material-ui/core';

export interface ListElementAvatarProps {
  avatarElement?: any;
  primaryElement?: JSX.Element;
  secondaryElement?: JSX.Element;
  primaryText?: string;
  secondaryText?: string;
  button?: boolean;
  link?: string;
  badge?: UserBadge;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contentContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
  })
);

export default function ListElementAvatar(props: ListElementAvatarProps) {
  const {
    avatarElement,
    primaryElement,
    secondaryElement,
    primaryText,
    secondaryText,
    button,
    link,
    badge,
  } = props;
  const classes = useStyles();

  return (
    <ListItem
      // @ts-ignore
      button={button && link ? button : undefined}
      component={button && link ? AdapterLink : undefined}
      to={button && link ? link : undefined}
    >
      {primaryElement}
      <ListItemAvatar>
        {avatarElement ? avatarElement : undefined}
      </ListItemAvatar>
      <div className={classes.contentContainer}>
        <div className={classes.textContainer}>
          {primaryText && (
            <Typography variant="body1">{primaryText}</Typography>
          )}
          {secondaryText && (
            <Typography variant="body2" color="textSecondary">
              {secondaryText}
            </Typography>
          )}
        </div>
        {badge && <UserBadgeIcon badge={badge} size={24} />}
      </div>
      {/* <ListItemText
        primary={primaryText ? primaryText : undefined}
        secondary={secondaryText ? secondaryText : undefined}
      /> */}
      {secondaryElement}
    </ListItem>
  );
}
