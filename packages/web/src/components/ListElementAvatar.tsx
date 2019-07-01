import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import AdapterLink from './AdapterLink';

export interface ListElementAvatarProps {
  avatarElement?: any;
  primaryText?: string;
  secondaryText?: string;
  secondaryElement?: any;
  button?: boolean;
  link?: string;
}

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export default function ListElementAvatar(props: ListElementAvatarProps) {
  const classes = useStyles();

  const {
    avatarElement,
    primaryText,
    secondaryText,
    secondaryElement,
    button,
    link,
  } = props;

  return (
    <ListItem
      // @ts-ignore
      button={button && link ? button : undefined}
      component={button && link ? AdapterLink : undefined}
      to={button && link ? link : undefined}
    >
      <ListItemAvatar>
        {avatarElement ? (
          avatarElement
        ) : (
          <Avatar>
            <PersonIcon />
          </Avatar>
        )}
      </ListItemAvatar>
      <ListItemText
        primary={primaryText ? primaryText : 'Group member'}
        secondary={secondaryText ? secondaryText : null}
      />
      {secondaryElement}
    </ListItem>
  );
}
