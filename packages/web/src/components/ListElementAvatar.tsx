import React from 'react';

import type { UserBadge } from '@caravanapp/types';
import {
  createStyles,
  ListItem,
  ListItemAvatar,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import AdapterLink from './AdapterLink';
import UserBadgeIcon from './UserBadgeIcon';

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
